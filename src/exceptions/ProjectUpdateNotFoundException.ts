import HttpException from "./HttpException"

class ProjectUpdateNotFoundException extends HttpException {
    
    /**
     * @param  {string} id
     */
    constructor (id: string)
    {
        super({
            status: 404,
            message: `Project update with id ${id} not found`
        })
    }
}

export default ProjectUpdateNotFoundException