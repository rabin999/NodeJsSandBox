import { Router } from "express"
import ProjectUpdateStatusController from "../controllers/projectUpdateStatus.controller"
import ProjectUpdateStatus from "../request/projectStatus.request"
import RoleMiddleware from "../../../middleware/role.middleware"

class ProjectStatusRoutes {

    public _route: any

    constructor () 
    {
        this._route = Router()

        this._route.get("/:projectUpdateId", new ProjectUpdateStatusController().projectUpdateStatus)
        this._route.post("/:projectUpdateId/create", RoleMiddleware(["projectManager", "client"]), ProjectUpdateStatus, new ProjectUpdateStatusController().create)
        this._route.put("/:id/update", RoleMiddleware(["projectManager", "client"]), new ProjectUpdateStatusController().update)
        this._route.delete("/:id/delete", RoleMiddleware(["projectManager", "client"]), new ProjectUpdateStatusController().delete)
    }

    get route()
    {
        return this._route;
    }
}

export default ProjectStatusRoutes
