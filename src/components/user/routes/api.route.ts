import { Router, Request, Response, NextFunction } from "express"
import UserController from "../controllers/user.controller"
import SignUpRequest from "../request/user.request"

class UserRoutes {

    public _route: any
    
    constructor () 
    {
        this._route = Router()

        this._route.post("/signup", SignUpRequest, new UserController().create)
        this._route.put("/:id/update", new UserController().update)
        this._route.delete("/:id/delete", new UserController().delete)
    }

    get route()
    {
        return this._route;
    }
}

export default UserRoutes