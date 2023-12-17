import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { IContext } from "../sub_types/context.js";
import { Order, OrderProducts, OrdersModel, PlaceOrderResult } from "./types.js";
import { GetOrdersInput, PlaceOrderInput, UpdateOrderInput } from "./inputs.js";
import { ProductsModel } from "../products/types.js";
import { LocalPaymentsService } from "../services/local_payments.js";


@Resolver()
export class OrdersResolvers {

    @Mutation(()=> PlaceOrderResult, { nullable: false, })
    async placeOrder(
        @Arg("input") input: PlaceOrderInput,
        @Ctx() context: IContext,
    ) {

        const user = context.user

        if( !user && !input.phone ) {

            return {
                error: "You have to be logged in or provide A phone number to place an order."
            }
        }
        
        try {

            // const get products
            const products = await ProductsModel.find({ _id: { $in: input.products.map(p=> p.id) } }).lean()
            let cartProducts: Array<OrderProducts> = []

            for (const product of input.products) {
                const cartProduct = products.find((p)=> {
                    return p.variants.filter(v=> v.name.toLowerCase() == product.variant)
                })

                if( !cartProduct ) {

                    break
                }

                const cartProductPrice = cartProduct.variants.find((v)=> v.name.toLowerCase() == product.variant).price
                
                cartProducts.push({
                    id: product.id,
                    name: cartProduct.name,
                    variantName: product.variant,
                    price: cartProductPrice as number,
                    quantity: product.quantity,
                })
            }

            if( !cartProducts.length ) {

                return {
                    error: "Your order is invalid. Please check the items you ordered and try again."
                }
            }

            // total price
            const totalPrice = cartProducts.map(p=> p.price * p.quantity).reduce((acc, p)=> acc + p, 0)

            // initiate payment
            const x = await LocalPaymentsService.initiatePayment({ amount: totalPrice, phone: user?.phone || input.phone, })

            // save
            const order = await new OrdersModel({
                accountId: user?._id || input.phone,
                accountType: user != null ? "ACCOUNT" : "PHONE",
                orderType: "USER",

                products: cartProducts,
                payments: [],
                totalPaid: 0,
                totalPrice,
            }).save()


            // initiate payment



            return order
        } catch (error) {
            
            console.log("Error in placeOrder ", error)
            return { "error": "An error occurred while placing your order. Please try again." }
        }
    }


    @Authorized()
    @Mutation(()=> Boolean, { nullable: false, })
    async updateOrder( @Arg("input") input: UpdateOrderInput,  @Ctx() context: IContext, ) {

        // ensure user is an admin
        const user = context.user
        if( user?.role != "ADMIN" ) {

            return { error: "Not Authorized" }
        }
        
        try {

            const { id, ...updates } = input
            const result = await ProductsModel.findByIdAndUpdate(id, { ...updates, })
            console.log("result ", result);
            
            return true
        } catch (error) {
            
            console.log("Error in updateOrder ", error)
            return false
        }
    }

    @Authorized()
    @Mutation(()=> Boolean, { nullable: false, })
    async updateOrderStatus( @Arg("status") status: string, @Arg("status") id: string, @Ctx() context: IContext, ) {

        // ensure user is an admin
        const user = context.user
        if( user?.role != "ADMIN" ) {

            return { error: "Not Authorized" }
        }
        
        try {

            const result = await ProductsModel.findByIdAndUpdate(id, { status, })
            console.log("result ", result);
            
            return true
        } catch (error) {
            
            console.log("Error in updateOrderStatus ", error)
            return false
        }
    }


    @Query(()=> Order, { nullable: false, })
    async getOrderDetails( @Arg("status") id: string, @Arg("phone") phone: string, @Ctx() context: IContext, ) {

        // ensure user is an admin
        const user = context.user
        
        try {

            if( user?.role === "ADMIN" ) {

                return await ProductsModel.findById(id)
            }

            if( !user ) {

                return await ProductsModel.findOne({ accountId: phone, })
            } else {

                return await ProductsModel.findOne({ accountId: user?._id, })
            }
        } catch (error) {
            
            return null
        }
    }

    @Authorized()
    @Query(()=> [Order], { nullable: false, })
    async getOrders( @Arg("input") input: GetOrdersInput, @Ctx() context: IContext, ) {

        // ensure user is an admin
        const user = context.user
        if( user?.role != "ADMIN" ) {

            return { error: "Not Authorized" }
        }
        
        // remove null search parameters
        const filters = Object.fromEntries(
            Object.entries(input).filter((arr)=> arr[1] != null)
        )

        try {

            const products =  await ProductsModel.find(filters).lean()
            
            return products
        } catch (error) {
            
            return []
        }
    }

}