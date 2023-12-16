import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Field, ObjectType, createUnionType } from "type-graphql";
import { ErrorResult } from "../sub_types/error.js";


@ObjectType("ProductVariant")
export class ProductVariant {

    @Field(()=> String, { nullable: false })
    @prop({ required: false, })
    image: String

    @Field(()=> String, { nullable: false })
    @prop({ required: false, })
    name: String

    @Field(()=> Number, { nullable: false })
    @prop({ required: false, })
    price: Number

    @Field(()=> Number, { nullable: true })
    @prop({ required: false, })
    discount?: Number

    @Field(()=> Number, { nullable: true })
    @prop({ required: false, })
    discountStartDate?: Number

    @Field(()=> Number, { nullable: true })
    @prop({ required: false, })
    discountLastDate?: Number
}

@ObjectType("Product")
export class Product {
    
    @Field(()=> String, { nullable: true })
    _id?: string

    @Field(()=> String, { nullable: true })
    @prop({ required: true, })
    name?: string

    @Field(()=> String, { nullable: true })
    @prop({ required: true, })
    description?: string

    @Field(()=> String, { nullable: true })
    @prop({ required: true, index: true, })
    brand: string

    @Field(()=> String, { nullable: true })
    @prop({ required: true, index: true, })
    model: string

    @Field(()=> [Number], { nullable: false })
    @prop({ required: true, })
    years: mongoose.Types.Array<Number>
    

    @Field(()=> [ProductVariant], { nullable: false })
    @prop({ required: true, })
    variants: mongoose.Types.Array<ProductVariant>
    
    // how many days it may be delivered in
    @Field(()=> Number, { nullable: false })
    @prop({ required: true, })
    deliveryDays: Number
    
    
}

// this is the mongo model
export const ProductsModel = getModelForClass(Product)


// add result
export const AddProductResult = createUnionType({
    name: "AddProductResult",
    types: ()=> [ ErrorResult, Product ],
    resolveType: (result) => {
        

        if( "name" in result ) {

            return Product
        }

        if( "error" in result ) {

            return ErrorResult
        }

        return undefined
    }
})

