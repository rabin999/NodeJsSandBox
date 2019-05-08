import HttpException from "./HttpException"

class WrongAuthenticationTokenException extends HttpException {
    constructor ()
    {
        super({
            status: 401,
            message: "Invalid authentication token"
        })
    }
}

export default WrongAuthenticationTokenException