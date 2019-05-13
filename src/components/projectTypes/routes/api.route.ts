import { Router, Request, Response, NextFunction } from "express"
import ProjectTypeController from "../controllers/projectType.controller"
import ProjectCreateRequest from "../request/projectType.request"
import RoleMiddleware from "../../../middleware/role.middleware"

class ProjecTypeRoute {

    public _route: any
    
    constructor () 
    {
        this._route = Router()
        
        this._route.get("/", new ProjectTypeController().allProjectTypes)
        this._route.post("/create", RoleMiddleware(["admin"]), ProjectCreateRequest, new ProjectTypeController().create)
        this._route.delete("/:id/delete", RoleMiddleware(["admin"]), new ProjectTypeController().delete)
    }

    get route()
    {
        return this._route;
    }
}

export default ProjecTypeRoute