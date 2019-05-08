import HttpException from "./HttpException"

class WrongCredentialsException extends HttpException {
    constructor ()
    {
        super({
            status: 401,
            message: "Wrong credentials provided"
        })
    }
}

export default WrongCredentialsException