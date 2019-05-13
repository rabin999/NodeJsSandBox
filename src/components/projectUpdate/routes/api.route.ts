import { Router } from "express"
import ProjectUpdateController from "../controllers/projectUpdate.controller"
import ProjectUpdateRequest from "../request/projectUpdate.request"

class ProjectUpdateRoutes {

    public _route: any
    
    constructor () 
    {
        this._route = Router()

        this._route.get("/:projectId", new ProjectUpdateController().projectUpdates)
        this._route.post("/create", ProjectUpdateRequest, new ProjectUpdateController().create)
        this._route.post("/:id/seen/true", new ProjectUpdateController().updateSeen)
        this._route.put("/:id/update", ProjectUpdateRequest, new ProjectUpdateController().update)
        this._route.delete("/:id/delete", new ProjectUpdateController().delete)
    }

    get route()
    {
        return this._route;
    }
}

export default ProjectUpdateRoutes