import passport from "passport"
import passportLocal from "passport-local"
import uuid from "uuid/v4"
import User from "../../components/user/model/user.model"
import { Request, Response, NextFunction } from "express"
import oauth2orize from "oauth2orize"
import config from "../../config"
import moment from "moment"

// Create OAuth 2.0 server
const server = oauth2orize.createServer();

// Exchange user id and password for access tokens. The callback accepts the
// `client`, which is exchanging the user's name and password from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the user who authorized the code.

server.exchange(oauth2orize.exchange.password(async (client, email, password, scope, done) => {
    try {
        await User.findOne({ email: email.toLowerCase() }, (err, user: any) => {
            if (err) {
                return done(err)
            }

            if (!user) {
                return done(undefined, false, { message: `Email ${email} not found.` })
            }

            user.comparePassword(password, async (err: Error, isMatch: boolean) => {
                if (err) { return done(err) }

                if (isMatch) {
                    const accessToken = uuid(user.email)

                    let token = {
                        accessToken,
                        scopes: scope,
                        expiresAt: moment().add(config.tokenExipiresAt, 'months')
                    }
                    
                    // Update user token
                    await User.findOneAndUpdate({ "email": email.toLowerCase() }, {
                        "token.accessToken": token.accessToken,
                        "token.scopes": token.scopes,
                        "token.expiresAt": token.expiresAt
                    }).exec()
                
                    return done(null, token.accessToken, null, { expires_at: moment(token.expiresAt).valueOf(), scopes: token.scopes })

                } else {
                    return done(undefined, false, { message: "Invalid email or password" })
                }                
            })
        })

    } catch (error) {
        return done(undefined, false, { message: error.toString() })
    }
}))

// Token endpoint.
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens. Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request. Clients must
// authenticate when making requests to this endpoint.
export default [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
]
