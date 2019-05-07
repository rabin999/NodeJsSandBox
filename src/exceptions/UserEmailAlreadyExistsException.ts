import HttpException from "./HttpException"

class UserEmailAlreadyExistsException extends HttpException {
    
    /**
     * @param  {string} email
     */
    constructor (email: string) 
    {
        super(400, `User with email ${email} already exists`)
    }
}

export default UserEmailAlreadyExistsException