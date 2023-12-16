import { getModelForClass, prop } from "@typegoose/typegoose";
import { IsNotEmpty, Min, MinLength } from "class-validator";
import mongoose from "mongoose";
import { Field, InputType, ObjectType, createUnionType } from "type-graphql";


@InputType("ProductVariantInput")
export class ProductVariantInput {

    @IsNotEmpty()
    @Field(()=> String, { nullable: false })
    image: String

    @IsNotEmpty()
    @MinLength(4, { message: "Name must be longer than 4 characters" })
    @Field(()=> String, { nullable: false })
    name: String

    @IsNotEmpty()
    @Field(()=> Number, { nullable: false })
    price: Number

    @Field(()=> Number, { nullable: true })
    discount?: Number

    @Field(()=> Number, { nullable: true })
    discountStartDate?: Number

    @Field(()=> Number, { nullable: true })
    discountLastDate?: Number
}

@InputType("ProductInput")
export class ProductInput {

    @IsNotEmpty()
    @MinLength(4, { message: "Name must be longer than 4 characters" })
    @Field(()=> String, { nullable: true })
    name?: string

    @Field(()=> String, { nullable: true })
    description?: string

    @IsNotEmpty()
    @Field(()=> String, { nullable: true })
    brand: string

    @IsNotEmpty()
    @Field(()=> String, { nullable: true })
    model: string

    @IsNotEmpty()
    @Field(()=> [Number], { nullable: false })
    years: mongoose.Types.Array<Number>
    
    @IsNotEmpty()
    @Field(()=> [ProductVariantInput], { nullable: false })
    variants: mongoose.Types.Array<ProductVariantInput>
    
    // how many days it may be delivered in
    @Field(()=> Number, { nullable: false })
    deliveryDays: Number
    
}


@InputType("SearchProductsInput")
export class SearchProductsInput {

    @Min(20)
    @Field(()=> Number, { nullable: true, })
    limit?: number

    @Min(0)
    @Field(()=> Number, { nullable: true, })
    offset?: number

    @Field(()=> String, { nullable: true, })
    brand?: string

    @Field(()=> String, { nullable: true, })
    name?: string

    @Field(()=> String, { nullable: true, })
    model?: string

}
