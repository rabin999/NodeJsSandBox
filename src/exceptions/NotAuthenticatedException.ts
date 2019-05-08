import HttpException from "./HttpException"

class NotAuthenticatedException extends HttpException {
    constructor ()
    {
        super(401, "You are not authorized")
    }
}

export default NotAuthenticatedException