import HttpException from "./HttpException"

class UserNotFoundException extends HttpException {
    
    /**
     * @param  {string} id
     */
    constructor (id: string)
    {
        super({
            status: 404,
            message: `User with ${id} not found`
        })
    }
}

export default UserNotFoundException