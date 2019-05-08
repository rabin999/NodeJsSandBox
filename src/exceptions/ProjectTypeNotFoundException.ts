import HttpException from "./HttpException"

class ProjectTypeNotFoundException extends HttpException {
    
    /**
     * @param  {string} id
     */
    constructor (id: string)
    {
        super({
            status: 404,
            message: `Project type with id ${id} not found.`
        })
    }
}

export default ProjectTypeNotFoundException