import { prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Field, InputType, } from "type-graphql";
import { IsNotEmpty, MinLength } from "class-validator";


@InputType("PlaceOrderProductInput")
export class PlaceOrderProductInput {
    
    @Field(()=> String, { nullable: false })
    id: string

    @Field(()=> String, { nullable: false })
    variant: string

}

@InputType("PlaceOrderInput")
export class PlaceOrderInput {
    
    @IsNotEmpty()
    @MinLength(1)
    @Field(()=> [PlaceOrderProductInput], { nullable: false })
    @prop({ required: true, })
    products: mongoose.Types.Array<PlaceOrderProductInput>

    
}
