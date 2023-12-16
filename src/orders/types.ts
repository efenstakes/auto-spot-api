import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Field, ObjectType, createUnionType } from "type-graphql";
import { ErrorResult } from "../sub_types/error.js";


@ObjectType("OrderPayment")
export class OrderPayment {

    @Field(()=> String, { nullable: false })
    @prop({ required: true, })
    id: String

    @Field(()=> String, { nullable: false })
    @prop({ required: true, })
    phone: String

    @Field(()=> String, { nullable: false })
    @prop({ enum: [ 'MPESA', 'BANK', ] })
    type: String

    @Field(()=> Number, { nullable: false })
    @prop({ required: false, })
    amount: Number

    @Field(()=> String, { nullable: false })
    @prop({ enum: [ 'MPESA', 'BANK', ] })
    code: String

    @Field(()=> Number, { nullable: true })
    @prop({ default: Date.now() })
    madeOn?: Number

}


@ObjectType("OrderProducts")
export class OrderProducts {

    @Field(()=> String, { nullable: false })
    @prop({ required: true, })
    id: String

    @Field(()=> String, { nullable: false })
    @prop({ required: true, })
    name: String

    @Field(()=> String, { nullable: false })
    @prop({ required: true, })
    variantName: String

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

@ObjectType("Order")
export class Order {
    
    @Field(()=> String, { nullable: true })
    _id?: string

    @Field(()=> String, { nullable: true })
    @prop({ required: true, })
    accountId?: string

    @Field(()=> String, { nullable: true })
    @prop({ enum: [ "ACCOUNT", "PHONE" ], })
    accountType?: string

    @Field(()=> Number, { nullable: false })
    @prop({ required: true, })
    totalPrice: number
    
    @Field(()=> [OrderProducts], { nullable: false })
    @prop({ required: true, })
    products: mongoose.Types.Array<OrderProducts>

    @Field(()=> [OrderPayment], { nullable: false })
    @prop({ required: true, })
    payments: mongoose.Types.Array<OrderPayment>

    @Field(()=> Number, { nullable: true })
    @prop({ default: 0, })
    totalPaid?: number

    @Field(()=> Number, { nullable: true })
    @prop({ })
    shippingInitiatedOn?: number

    @Field(()=> String, { nullable: true })
    @prop({ default: "PROCESSING", enum: [ 'DELIVERED', 'SHIPPPING', 'READY', 'PROCESSING', 'CANCELLED', 'DENIED' ] })
    status: string


    @Field(()=> String, { nullable: true })
    @prop({ default: "CUSTOMER", enum: [ 'CUSTOMER', 'ADMIN' ] })
    orderType: string

    @Field(()=> Number, { nullable: false })
    @prop({ default: Date.now(), })
    madeOn: number
    
}

// this is the mongo model
export const OrdersModel = getModelForClass(Order)


// add result
export const PlaceOrderResult = createUnionType({
    name: "PlaceOrderResult",
    types: ()=> [ ErrorResult, Order ],
    resolveType: (result) => {
        

        if( "_id" in result ) {

            return Order
        }

        if( "error" in result ) {

            return ErrorResult
        }

        return undefined
    }
})

