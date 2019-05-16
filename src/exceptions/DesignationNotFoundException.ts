import HttpException from "./HttpException"

class DesignationNotFoundException extends HttpException {
    
    /**
     * @param  {string} id
     */
    constructor (id: string)
    {
        super({
            status: 404,
            message: `Designation with id ${id} not found`
        })
    }
}

export default DesignationNotFoundException