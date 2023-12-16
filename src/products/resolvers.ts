import { Arg, Args, Authorized, Ctx, Query, Resolver } from "type-graphql";
import { Product, ProductsModel } from "./types.js";
import { SearchProductsInput } from "./input.js";


@Resolver()
export class ProductsResolvers {

    @Query(()=> [Product], { defaultValue: [], })
    async getProducts(
        @Arg("input") input: SearchProductsInput,
        @Arg("limit", { defaultValue: 40 }) limit: number,
        @Arg("offset", { defaultValue: 0 }) offset: number,
    ) {

        // remove null search parameters
        const filters = Object.fromEntries(
            Object.entries(input).filter((arr)=> arr[1] != null)
        )

        const products = await ProductsModel.find({ ...filters })
            .lean()
            .skip(offset)
            .limit(limit)

        return products
    }
    
}