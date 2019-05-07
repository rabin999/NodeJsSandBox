import HttpException from "./HttpException"

class NotAuthorizedException extends HttpException {
    constructor () 
    {
        super(403, "You are not authorized")
    }
}

export default NotAuthorizedException