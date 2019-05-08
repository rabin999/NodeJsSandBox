import { Router } from "express"
import ProjectController, * as projectController from "../controllers/project.controller"
import ProjectCreateRequest from "../request/project.request"

class ProjectRoutes {

    public _route: any

    constructor () 
    {
        this._route = Router()

        this._route.get("/", new ProjectController().projects)
        this._route.post("/create", ProjectCreateRequest, new ProjectController().create)
        this._route.put("/:id/update", new ProjectController().update)
        this._route.delete("/:id/delete", new ProjectController().delete)
    }

    get route()
    {
        return this._route;
    }
}

export default ProjectRoutes
