import { Arg, Args, Authorized, Ctx, Query, Resolver } from "type-graphql";
import { IContext } from "../sub_types/context.js";
import { AccountsModel, AuthenticationResult } from "./types.js";
import admin from 'firebase-admin'
import { AuthenticationService } from "../services/authentication.js";


@Resolver()
export class ProductsResolvers {


    @Authorized()
    @Query(()=> AuthenticationResult, { nullable: false, })
    async authenticate( @Arg("token") token: string, @Ctx() context: IContext ) {

        try {

            // get user data by verifying token
            const result = await admin.auth().verifyIdToken(token)

            console.log("result ", result)


            // check if name or email is used
            let account = await AccountsModel.findOne({ email: result.email }).lean()
            
            console.log("account ", account)


            if( !account ) {

                // collect user data
                const accountData = {
                    name: result['name'],
                    email: result.email,
                    phone: result.phone_number,
                    picture: result.picture,
                    type: "USER",
                    joinedOn: Date.now() 
                }
                console.log("accountData ", accountData)
                const newAccount = await new AccountsModel(accountData).save()
                account = newAccount.toObject()
            }

            const accessToken = AuthenticationService.generateAccessToken(account)
            const refreshToken = AuthenticationService.generateRefreshtoken(account)
    
            context.res.cookie('ACCESS_TOKEN', accessToken, { maxAge: 3600 * 24 * 30 * 3, httpOnly: false })
            context.res.cookie('REFRESH_TOKEN', refreshToken, { maxAge: 3600 * 24 * 30 * 6, httpOnly: false })
            

            console.log('account ', account)
            return {
                ...account,
                accessToken,
                refreshToken,
            }
            
        } catch (error) {
            console.log("Error in signup ", error)
            return null
        }
    }


}