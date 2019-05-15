import { Router, Request, Response, NextFunction } from "express"
import UserController from "../controllers/user.controller"
import SignUpRequest from "../request/create.request"
import UpdateRequest from "../request/update.request"
import RoleMiddleware from "../../../middleware/role.middleware"

class UserRoutes {

    public _route: any
    
    constructor ()
    {
        this._route = Router()

        this._route.get("/", RoleMiddleware(["admin"]), new UserController().users)
        this._route.get("/:id/profilePicture", new UserController().profilePicture)
        this._route.get("/profile", new UserController().profile)
        this._route.post("/signup", RoleMiddleware(["admin"]), SignUpRequest, new UserController().create)
        this._route.post("/:id/uploadProfile", new UserController().uploadProfile)
        this._route.put("/:id/update", UpdateRequest, new UserController().update)
        this._route.delete("/:id/delete", RoleMiddleware(["admin"]), new UserController().delete)
    }

    get route()
    {
        return this._route;
    }
}

export default UserRoutes