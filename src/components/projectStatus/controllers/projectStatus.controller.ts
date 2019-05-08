import { Request, Response, NextFunction } from "express"

class ProjectStatusController {
    
    /**
     * GET /projects
     * Create a new member account
     */
    projects = (req: Request, res: Response, next: NextFunction) => {
        res.send("you are in project page")
    }
}

export default ProjectStatusController