import { AuthChecker } from "type-graphql"
import { IContext } from "../sub_types/context.js"

const jwt = require('jsonwebtoken')


export class AuthenticationService {


    static authenticateAuthorizationHeaders = async (req, res, next) => {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            req.user = null
            next()
            return
        }
        
        const idToken = req.headers.authorization.split(' ')[1];
        try {
            const payload = jwt.verify(idToken, process.env.ACCESS_TOKEN)

            if( !payload ) {
                req.user = null
                next()
                return
            }
            
            req.user = payload

            next()
            return
        } catch(e) {
            req.user = null
            next()
            return
        }
    }


    static authenticateCookies = async (req, res, next) => {
        const accessToken = req.cookies?.ACCESS_TOKEN
        const refreshToken = req.cookies?.REFRESH_TOKEN

        console.log("access_token ", accessToken)
        console.log("refresh_token ", refreshToken)

        if( !accessToken ) {
            next()
            return
        }
        // next()
        
        try {
            const payload = AuthenticationService.verifyAccessToken(accessToken)
            const refreshPayload = AuthenticationService.verifyRefreshToken(refreshToken)
            
            if( !payload && refreshPayload ) {
                console.log("refreshPayload ", refreshPayload)

                res.cookie('ACCESS_TOKEN', AuthenticationService.generateAccessToken(refreshPayload), { maxAge: 3600 * 24 * 30 * 3, httpOnly: false })
                res.cookie('REFRESH_TOKEN', AuthenticationService.generateRefreshtoken(refreshPayload), { maxAge: 3600 * 24 * 60 * 6, httpOnly: false })
                
                req.user = refreshPayload
            }
            
            if( payload ) {
                console.log("} else if( payload ) {")
                const { password, ...user } = payload
                req.user = user
            }

            next()
            return
        } catch(e) {
            req.user = null
            next()
            return
        }
    }


    static generateAccessToken = (account) => {
        return jwt.sign(
            { ...account }, 
            process.env.ACCESS_TOKEN, 
            { expiresIn: '.25y', subject: account._id.toString() }
        )
    }

    static generateRefreshtoken = (account) => {
        return jwt.sign(
            { ...account }, 
            process.env.REFRESH_TOKEN, 
            { expiresIn: '.5y', subject: account._id.toString() }
        )
    }


    static verifyAccessToken = (token)=> {
        try {
            const payload = jwt.verify(token, process.env.ACCESS_TOKEN)
            return payload
        } catch (e) {
            console.log("Error in verify_access_token ", e)
            return null
        }
    }

    static verifyRefreshToken = (token)=> {
        try {
            const payload = jwt.verify(token, process.env.REFRESH_TOKEN)
            return payload
        } catch (e) {
            console.log("Error in verify_access_token ", e)
            return null
        }
    }


    static authChecker: AuthChecker<IContext> = ({ context: { user, } })=> {

        return user != null || user != undefined
    }
}
