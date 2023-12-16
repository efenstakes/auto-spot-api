import { Field, ObjectType } from "type-graphql";


@ObjectType("ErrorResult")
export class ErrorResult {

    @Field(()=> String, { nullable: true, })
    error?: string

    @Field(()=> [String], { defaultValue: [], })
    errors: string[]

}