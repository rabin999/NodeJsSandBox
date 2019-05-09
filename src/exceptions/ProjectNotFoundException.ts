import HttpException from "./HttpException"

class ProjectNotFoundException extends HttpException {
    
    /**
     * @param  {string} id
     */
    constructor (id: string, title: string = "")
    {
        super({
            status: 404,
            title,
            message: `Project with id ${id} not found`
        })
    }
}

export default ProjectNotFoundException