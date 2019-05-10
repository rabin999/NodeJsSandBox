import { Router } from "express"
import ProjectStatuController from "../controllers/projectStatus.controller"

class ProjectStatusRoutes {

    public _route: any

    constructor () 
    {
        this._route = Router()

        this._route.get("/", new ProjectStatuController().projectStatus)
    }

    get route()
    {
        return this._route;
    }
}

export default ProjectStatusRoutes
