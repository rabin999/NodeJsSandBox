import { Request, Response, NextFunction } from "express"
import User  from "../model/index.model"

class UserController {
    /**
     * POST /signup
     * Create a new member account
     */
    public singUp = async (req: Request, res: Response, next: NextFunction) => {
        // const user = await User.create({
        //     fullname: "John Mayer",
        //     email: "john@gmail.com",
        //     password: "password@1",
        //     role: "project_manager",
        // })
        res.send("Hello signup user")
    }

    /**
     * GET /users
     * Create a new member account
     */
    public allUser = (req: Request, res: Response, next: NextFunction) => {
        res.send("you are in all users, rock and roll")
    }
}

export default UserController