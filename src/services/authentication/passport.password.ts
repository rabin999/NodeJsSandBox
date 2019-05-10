import passport from "passport"
import LocalStrategy from "passport-local"
import { BasicStrategy } from "passport-http"
import { Strategy as BearerStrategy } from "passport-http-bearer"
import { Strategy as ClientPasswordStrategy } from "passport-oauth2-client-password"
import User from "../../components/user/model/user.model"
import { Request, Response, NextFunction } from "express"
import config from "../../config"
import NotAuthenticatedException from "../../exceptions/NotAuthenticatedException"

class PassportManager {

    constructor() {

        passport.serializeUser<any, any>((user, done) => {
            done(undefined, user.id)
        })

        passport.deserializeUser((id, done) => {
            User.findById(id, (err, user) => {
                done(err, user)
            })
        })

        // passport.use(new BasicStrategy(this.verifyClient))
        // passport.use(new ClientPasswordStrategy(this.verifyClient))
        // this.passport()

    }

    /**
    * BearerStrategy
    *
    * This strategy is used to authenticate either users or clients based on an access token
    * (aka a bearer token). If a user, they must have previously authorized a client
    * application, which is issued an access token to make requests on behalf of
    * the authorizing user.
    */
    public bearer() {
        passport.use(new BearerStrategy(
            async (accessToken, done) => {
                try {
                    let tokenUser = await User.findOne({ "token.accessToken": accessToken }).exec()

                    if (!tokenUser)
                        return done(null, false, { message: "Token not found" })

                    tokenUser = tokenUser.toJSON()

                    // check token expire date
                    const todayDate = new Date().getTime()
                    const expireDate = new Date(tokenUser.token.expiresAt).getTime()
                    const expired = todayDate - expireDate

                    if (expired > 0) {
                        return done(null, false, { message: 'Token has been expired.' })
                    }

                    // find using userId
                    if (tokenUser) {
                        return done(null, tokenUser)
                    }
                } catch (error) {
                    return done(null, false);
                }
            }
        ))
    }

    public isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            return next()
        }
        else {
            return next(new NotAuthenticatedException())
        }
    }

    /**
     * Sign In using Email and Password
     */
    public passport() {
        passport.use(new LocalStrategy.Strategy({ usernameField: "email" }, async (email, password, done) => {
            await User.findOne({ email: email.toLowerCase() }, (err, user: any) => {
                console.log("Email is %s-------", email)
                if (err) {
                    return done(err)
                }

                if (!user) {
                    return done(undefined, false, { message: `Email ${email} not found.` })
                }

                user.comparePassword(password, (err: Error, isMatch: boolean) => {
                    if (err) { return done(err) }

                    if (isMatch) {
                        return done(undefined, user)
                    }

                    return done(undefined, false, { message: "Invalid email or password" })
                })
            })
        }))
    }

    /**
     * BasicStrategy & ClientPasswordStrategy
     *
     * These strategies are used to authenticate registered OAuth clients. They are
     * employed to protect the `token` endpoint, which consumers use to obtain
     * access tokens. The OAuth 2.0 specification suggests that clients use the
     * HTTP Basic scheme to authenticate. Use of the client password strategy
     * allows clients to send the same credentials in the request body (as opposed
     * to the `Authorization` header). While this approach is not recommended by
     * the specification, in practice it is quite common.
     */
    public verifyClient = (clientId: any, clientSecret: any, done: any) => {
        if (!config.client_secret)
            return done(null, false, { message: 'Client secret not found.' })

        if (config.client_secret !== clientSecret)
            return done(null, config.client_secret)

        return done(null, false);
    }
}

export default PassportManager