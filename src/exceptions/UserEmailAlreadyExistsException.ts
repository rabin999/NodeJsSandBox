import HttpException from "./HttpException"

class UserEmailAlreadyExistsException extends HttpException {
    
    /**
     * @param  {string} email
     * @param  {any={}} options
     */
    constructor (email: string, options: any = {}) 
    {
        super({
            status: 400,
            title: "User already exists",
            message: `User with email ${email} already exists`
        }, options)
    }
}

export default UserEmailAlreadyExistsException