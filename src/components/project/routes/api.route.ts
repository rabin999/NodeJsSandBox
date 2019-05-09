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
        this._route.put("/:id/update", ProjectCreateRequest, new ProjectController().update)
        this._route.delete("/:id/delete", new ProjectController().delete)
        this._route.put("/:id/add-members", new ProjectController().addMembers)
        this._route.put("/:id/remove-members", new ProjectController().removeMembers)
        this._route.put("/:id/add-owners", new ProjectController().addOwners)
        this._route.put("/:id/remove-owners", new ProjectController().removeOwners)
    }

    get route()
    {
        return this._route;
    }
}

export default ProjectRoutes
