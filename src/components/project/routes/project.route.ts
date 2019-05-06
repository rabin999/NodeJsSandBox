import { Router } from "express"
import ProjectController, * as projectController from "../controllers/project.controller"

class ProjectRoutes {

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

export default ProjectRoutes
