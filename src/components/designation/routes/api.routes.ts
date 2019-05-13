import { Router, Request, Response, NextFunction } from "express"
import DesignationController from "../controllers/designation.controller"
import DesignationRequest from "../request/designation.request"

class DesignationRoutes {

    public _route: any
    
    constructor () 
    {
        this._route = Router()

        this._route.get("/", new DesignationController().allDesignations)
        this._route.post("/create", DesignationRequest, new DesignationController().create)
        this._route.delete("/:id/delete", new DesignationController().delete)
    }

    get route()
    {
        return this._route
    }
}

export default DesignationRoutes