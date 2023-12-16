import { Arg, Args, Authorized, Ctx, Query, Resolver } from "type-graphql";
import { IContext } from "../sub_types/context.js";
import { OrderProducts, OrdersModel, PlaceOrderResult } from "./types.js";
import { PlaceOrderInput } from "./inputs.js";
import { ProductsModel } from "../products/types.js";


@Resolver()
export class ProductsResolvers {

    @Query(()=> PlaceOrderResult, { nullable: false, })
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

            const order = await new OrdersModel({
                accountId: user?._id || input.phone,
                accountType: user != null ? "ACCOUNT" : "PHONE",
                orderType: "USER",

                products: cartProducts,
                payments: [],
                totalPaid: 0,
                totalPrice,
            }).save()
            return order
        } catch (error) {
            
            console.log("Error in placeOrder ", error)
            return { "error": "An error occurred while placing your order. Please try again." }
        }
    }


}