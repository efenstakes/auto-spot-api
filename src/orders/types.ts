import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Field, ObjectType, createUnionType } from "type-graphql";
import { ErrorResult } from "../sub_types/error.js";


@ObjectType("OrderPayment")
export class OrderPayment {

    @Field(()=> String, { nullable: false })
    @prop({ required: true, })
    id: string

    @Field(()=> String, { nullable: false })
    @prop({ required: true, })
    phone: string

    @Field(()=> String, { nullable: false })
    @prop({ enum: [ 'MPESA', 'BANK', ] })
    type: string

    @Field(()=> Number, { nullable: false })
    @prop({ required: false, })
    amount: number

    @Field(()=> String, { nullable: false })
    @prop({ enum: [ 'MPESA', 'BANK', ] })
    code: string

    @Field(()=> Number, { nullable: true })
    @prop({ default: Date.now() })
    madeOn?: number

}


@ObjectType("OrderProducts")
export class OrderProducts {

    @Field(()=> String, { nullable: false })
    @prop({ required: true, })
    id: String

    @Field(()=> String, { nullable: false })
    @prop({ required: true, })
    name: string

    @Field(()=> String, { nullable: false })
    @prop({ required: true, })
    variantName: string

    @Field(()=> Number, { nullable: false })
    @prop({ required: false, })
    price: number

    @Field(()=> Number, { nullable: false })
    @prop({ required: false, })
    quantity: number

    @Field(()=> Number, { nullable: true })
    @prop({ required: false, })
    discount?: number

    @Field(()=> Number, { nullable: true })
    @prop({ required: false, })
    discountStartDate?: number

    @Field(()=> Number, { nullable: true })
    @prop({ required: false, })
    discountLastDate?: number
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

