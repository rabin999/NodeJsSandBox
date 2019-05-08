import { Router } from "express"
import ProjectController, * as projectController from "../controllers/projectStatus.controller"

class ProjectStatusRoutes {

    public _route: any

    constructor () 
    {
        this._route = Router()

        this._route.get("/", new ProjectController().projects)
    }

    get route()
    {
        return this._route;
    }
}

export default ProjectStatusRoutes
