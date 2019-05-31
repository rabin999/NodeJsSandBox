import { Router, Request, Response, NextFunction } from "express"
import HttpException from "../exceptions/HttpException"
import DashboardRoute from "../components/dashboard/routes/api.routes"

class BaseRoutes {

    public _route: any

    constructor ()
    {
        this._route = Router()
        this.initializeBaseRoutes()
    }

    private initializeBaseRoutes()
    {
        this._route.get("/", (req: Request, res: Response) => {
            res.send("welcome to sandbox API")
        })        
        
        // Password Reset link
        // this._route.use("/", new PasswordResetRoutes().route)

        // Check authorization
        // this._route.use(PassportAuthenticate)

        // init all api routes
        this._route.use("/dashboard", new DashboardRoute().route)
    }

    get route()
    {
        return this._route;
    }
}

export default BaseRoutes
