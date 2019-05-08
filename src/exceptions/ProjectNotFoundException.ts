import HttpException from "./HttpException"

class ProjectNotFoundException extends HttpException {
    
    /**
     * @param  {string} id
     */
    constructor (id: string)
    {
        super({
            status: 404,
            message: `Project with id ${id} not found`
        })
    }
}

export default ProjectNotFoundException