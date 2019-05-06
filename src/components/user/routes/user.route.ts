import { Router } from "express"
import UserController from "../controllers/user.controller"

class UserRoutes {

    public _route: any

    constructor () 
    {
        this._route = Router()

        this._route.post("/signup", new UserController().singUp)
        this._route.get("/", new UserController().allUser)
    }

    get route()
    {
        return this._route;
    }
}

export default UserRoutes