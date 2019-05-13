import { Router, Request, Response } from "express"
import userRoutes from "../components/user/routes/api.route"
import DesignationRoutes from "../components/designation/routes/api.routes"
import ProjectTypeRoutes from "../components/projectTypes/routes/api.route"
import ProjectRoutes from "../components/project/routes/api.route"
import ProjectUpdateRoutes from "../components/projectUpdate/routes/api.route"
import ProjectStatusRoutes from "../components/projectStatus/routes/api.route"
import passport from "passport"

class BaseRoutes {

    public _route: any

    constructor () 
    {
        this._route = Router()
        this.initializeBaseRoutes()
    }

    private initializeBaseRoutes() 
    {
        this.route.get("/", (req: Request, res: Response) => {
            res.send("welcome to API")
        })

        // Check authorization
        this._route.use(passport.authenticate('bearer', { session: false }))
        
        this._route.use("/users", new userRoutes().route)
        this._route.use("/designations", new DesignationRoutes().route)
        this._route.use("/project-types", new ProjectTypeRoutes().route)
        this._route.use("/projects", new ProjectRoutes().route)
        this._route.use("/project-updates", new ProjectUpdateRoutes().route)
        this._route.use("/project-status", new ProjectStatusRoutes().route)
    }

    get route()
    {
        return this._route;
    }
}

export default BaseRoutes