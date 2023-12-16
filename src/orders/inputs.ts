import { prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Field, InputType, } from "type-graphql";
import { IsNotEmpty, IsPhoneNumber, MinLength } from "class-validator";


@InputType("PlaceOrderProductInput")
export class PlaceOrderProductInput {
    
    @Field(()=> String, { nullable: false })
    id: string

    @Field(()=> String, { nullable: false })
    variant: string

    @Field(()=> Number, { defaultValue: 1, })
    quantity: number

}

@InputType("PlaceOrderInput")
export class PlaceOrderInput {
    
    @IsNotEmpty()
    @MinLength(1)
    @Field(()=> [PlaceOrderProductInput], { nullable: false })
    products: mongoose.Types.Array<PlaceOrderProductInput>

    @IsNotEmpty()
    @IsPhoneNumber()
    @Field(()=> String, { nullable: false })
    phone: string

    
}
