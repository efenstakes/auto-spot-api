import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ObjectType, createUnionType } from "type-graphql";
import { ErrorResult } from "../sub_types/error.js";


@ObjectType("Account")
export class Account {
    
    @Field(()=> String, { nullable: true })
    _id?: string

    @Field(()=> String, { nullable: false })
    @prop({ required: true, })
    name?: string

    @Field(()=> String, { nullable: false })
    @prop({ required: true, })
    email?: string

    @Field(()=> String, { nullable: true })
    @prop({ required: false, })
    phone: string

    @Field(()=> String, { nullable: true })
    @prop({ })
    picture: string

    @Field(()=> String, { nullable: true })
    @prop({ default: "USER", enum: [ "ADMIN", "USER" ] })
    role: string

    @Field(()=> Number, { nullable: false })
    @prop({ default: Date.now() })
    joinedOn: number
    
}

// this is the mongo model
export const AccountsModel = getModelForClass(Account)


// add result
export const AuthenticationResult = createUnionType({
    name: "AuthenticationResult",
    types: ()=> [ ErrorResult, Account ],
    resolveType: (result) => {
        

        if( "name" in result ) {

            return Account
        }

        if( "error" in result ) {

            return ErrorResult
        }

        return undefined
    }
})

