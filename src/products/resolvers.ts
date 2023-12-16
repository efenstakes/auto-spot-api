import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { AddProductResult, Product, ProductsModel } from "./types.js";
import { AddProductInput, SearchProductsInput } from "./input.js";
import { IContext } from "../sub_types/context.js";


@Resolver()
export class ProductsResolvers {


    @Authorized()
    @Mutation(()=> AddProductResult, { nullable: false, })
    async addProduct(
        @Arg("input") input: AddProductInput,
        @Ctx() context: IContext,
    ) {

        const user = context.user
        if( user.role != "ADMIN" ) {

            return { error: "Not Authorized" }
        }
        
        try {

            const newProduct = await new ProductsModel(input).save()
            return newProduct
        } catch (error) {
            
            console.log("Error in addProduct ", error)
            return { "error": "An error occurred while adding product. Please try again." }
        }
    }

    @Authorized()
    @Mutation(()=> AddProductResult, { nullable: false, })
    async updateProduct(
        @Arg("input") input: AddProductInput,
        @Arg("id") id: string,
        @Ctx() context: IContext,
    ) {

        const user = context.user
        if( user.role != "ADMIN" ) {

            return { error: "Not Authorized" }
        }
        
        try {

            const product = await ProductsModel.findByIdAndUpdate(id, { ...input }).lean()

            return product
        } catch (error) {
            
            console.log("Error in updateProduct ", error)
            return { "error": "An error occurred while updating product. Please try again." }
        }
    }
    

    @Query(()=> Product, { defaultValue: [], })
    async getProduct( @Arg("id") id: string ) {

        const product = await ProductsModel.findById(id).lean()

        return product
    }
    

    @Query(()=> [Product], { defaultValue: [], })
    async getProducts(
        @Arg("input") input: SearchProductsInput,
        @Arg("limit", { defaultValue: 40 }) limit: number,
        @Arg("offset", { defaultValue: 0 }) offset: number,
    ) {

        // remove null search parameters
        const filters = Object.fromEntries(
            Object.entries(input || {}).filter((arr)=> arr[1] != null)
        )
        console.log("filters ", filters);

        const products = await ProductsModel.find({ ...filters, })
            .lean()
            .skip(offset)
            .limit(limit)

        return products
    }
    
    
    @Authorized()
    @Mutation(()=> Boolean, { nullable: false, })
    async deleteProduct( @Arg("id") id: string,  @Ctx() context: IContext, ) {

        // ensure user is an admin
        const user = context.user
        if( user?.role != "ADMIN" ) {

            return { error: "Not Authorized" }
        }
        
        try {

            const result = await ProductsModel.findByIdAndDelete(id)
            console.log("result ", result);
            
            return true
        } catch (error) {
            
            console.log("Error in deleteProduct ", error)
            return false
        }
    }

}