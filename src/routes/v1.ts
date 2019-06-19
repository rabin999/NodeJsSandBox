import { Request, Response, Router } from "express"
import { readdir } from "fs";
import * as path from "path";
import FileNotFoundException from "../exceptions/FileNotFoundException";

class BaseRoutes {

    public _route: any

    constructor() {
        this._route = Router()
        this.initializeBaseRoutes()
    }

    private initializeBaseRoutes() {
        this._route.get("/", (req: Request, res: Response) => {
            res.send("welcome to sandbox API")
        });

        // Password Reset link
        // this._route.use("/", new PasswordResetRoutes().route)

        // Check authorization
        // this._route.use(PassportAuthenticate)

        // init all api routes without manuall including
        readdir(path.resolve(__dirname, "../components"), (err, items) => {
            if (err) {
                throw new FileNotFoundException("Folder doesn't exist");
            }
            items.forEach(item => {
                const pathDir: string = path.resolve(__dirname, "../components/" + item + "/routes/api.routes");

                import(pathDir).then((ComponentRoute) => {
                    this._route.use("/" + item, new ComponentRoute.default().route)
                }).catch(err => {
                    console.log(`Can't find route file ${err}`)
                });
            })
        });


    }

    get route() {
        return this._route;
    }
}

export default BaseRoutes
