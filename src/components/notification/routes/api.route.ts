import { Router } from "express"
import NotificationController from "../controllers/notification.controller"

class NotificationRoute {

    public _route: any

    constructor () 
    {
        this._route = Router()

        this._route.get("/", new NotificationController().notifications)
    }

    get route()
    {
        return this._route;
    }
}

export default NotificationRoute
