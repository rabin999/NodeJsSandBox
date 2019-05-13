import { Router } from "express"
import ProjectController, * as projectController from "../controllers/project.controller"
import ProjectCreateRequest from "../request/project.request"
import RoleMiddleware from "../../../middleware/role.middleware"

class ProjectRoutes {

    public _route: any

    constructor () 
    {
        this._route = Router()

        this._route.get("/", RoleMiddleware(["admin", "projectManager"]), new ProjectController().projects)
        this._route.post("/create", RoleMiddleware(["admin"]), ProjectCreateRequest, new ProjectController().create)
        this._route.put("/:id/update", RoleMiddleware(["admin"]), ProjectCreateRequest, new ProjectController().update)
        this._route.delete("/:id/delete", RoleMiddleware(["admin"]), new ProjectController().delete)
        this._route.put("/:id/add-members", RoleMiddleware(["admin", "projectManager"]), new ProjectController().addMembers)
        this._route.put("/:id/remove-members", RoleMiddleware(["admin", "projectManager"]), new ProjectController().removeMembers)
        this._route.put("/:id/add-owners", RoleMiddleware(["admin", "projectManager"]), new ProjectController().addOwners)
        this._route.put("/:id/remove-owners", RoleMiddleware(["admin", "projectManager"]), new ProjectController().removeOwners)
    }

    get route()
    {
        return this._route;
    }
}

export default ProjectRoutes
