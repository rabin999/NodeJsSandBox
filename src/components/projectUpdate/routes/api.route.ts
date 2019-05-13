import { Router } from "express"
import ProjectUpdateController from "../controllers/projectUpdate.controller"
import ProjectUpdateRequest from "../request/projectUpdate.request"
import RoleMiddleware from "../../../middleware/role.middleware"

class ProjectUpdateRoutes {

    public _route: any
    
    constructor () 
    {
        this._route = Router()

        this._route.get("/:projectId", RoleMiddleware(["admin", "projectManager"]), new ProjectUpdateController().projectUpdates)
        this._route.post("/create", RoleMiddleware(["admin", "projectManager"]), ProjectUpdateRequest, new ProjectUpdateController().create)
        this._route.post("/:id/seen/true", new ProjectUpdateController().updateSeen)
        this._route.put("/:id/update", RoleMiddleware(["admin", "projectManager"]), ProjectUpdateRequest, new ProjectUpdateController().update)
        this._route.delete("/:id/delete", RoleMiddleware(["admin", "projectManager"]), new ProjectUpdateController().delete)
    }

    get route()
    {
        return this._route;
    }
}

export default ProjectUpdateRoutes