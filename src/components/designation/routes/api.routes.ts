import { Router, Request, Response, NextFunction } from "express"
import DesignationController from "../controllers/designation.controller"
import DesignationRequest from "../request/designation.request"
import RoleMiddleware from "../../../middleware/role.middleware"

class DesignationRoutes {

    public _route: any
    
    constructor () 
    {
        this._route = Router()

        this._route.get("/", RoleMiddleware(["admin"]), new DesignationController().allDesignations)
        this._route.post("/create", RoleMiddleware(["admin"]), DesignationRequest, new DesignationController().create)
        this._route.delete("/:id/delete", RoleMiddleware(["admin"]), new DesignationController().delete)
    }

    get route()
    {
        return this._route
    }
}

export default DesignationRoutes