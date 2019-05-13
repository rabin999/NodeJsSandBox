import { Router } from "express"
import ProjectUpdateStatusController from "../controllers/projectUpdateStatus.controller"
import ProjectUpdateStatus from "../request/projectStatus.request" 

class ProjectStatusRoutes {

    public _route: any

    constructor () 
    {
        this._route = Router()

        this._route.get("/:projectUpdateId", new ProjectUpdateStatusController().projectUpdateStatus)
        this._route.post("/:projectUpdateId/create", ProjectUpdateStatus, new ProjectUpdateStatusController().create)
        this._route.delete("/:id/delete", new ProjectUpdateStatusController().delete)
    }

    get route()
    {
        return this._route;
    }
}

export default ProjectStatusRoutes
