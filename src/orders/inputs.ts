import { prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Field, InputType, } from "type-graphql";
import { IsMobilePhone, IsNotEmpty, IsPhoneNumber, Min, MinLength } from "class-validator";


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


@InputType("UpdateOrderInput")
export class UpdateOrderInput {
    
    @IsNotEmpty()
    @Field(()=> String, { })
    id: string

    @IsNotEmpty()
    @Field(()=> String, { })
    status: string

    @IsMobilePhone()
    @Field(()=> String, { })
    phone: string

    @Field(()=> Number, { })
    deliveryDays?: number

    @Field(()=> Number, {  })
    shippingInitiatedOn?: number

}


@InputType("GetOrdersInput")
export class GetOrdersInput {
    
    @IsNotEmpty()
    @Field(()=> String, { })
    status: string

    @IsNotEmpty()
    @Field(()=> String, { })
    brand: string

    @IsNotEmpty()
    @Field(()=> String, { })
    model: string

    @IsMobilePhone()
    @Field(()=> String, { })
    phone: string

    @Min(0)
    @Field(()=> Number, { defaultValue: 0, })
    offset?: number

    @Min(30)
    @Field(()=> Number, { defaultValue: 30, })
    limit?: number


    @Min(0)
    @Field(()=> Number, { })
    from?: number

    @Min(0)
    @Field(()=> Number, { })
    to?: number

}
