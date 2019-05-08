import HttpException from "./HttpException"

class DesignationNotFoundException extends HttpException {
    
    /**
     * @param  {string} id
     */
    constructor (id: string)
    {
        super(404, `Designation with id ${id} not found`)
    }
}

export default DesignationNotFoundException