import { Request, Response, NextFunction } from "express"
import User  from "../model/user.model"
import Designation from "../../designation/model/designation.model";

class UserController {
    /**
     * POST /signup
     * Create a new member account
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public singUp = async (req: Request, res: Response, next: NextFunction) => {

        const userDesignation = await Designation.create({
            title: "Hello Manager 5"
        })

        const user = await User.create({
            fullname: "John Mayer 5",
            email: "jsoh5sfdn@gmail.com",
            password: "password@1",
            role: "admin",
            designation: userDesignation.id
        })

        const newUser = await user.populate("designation").execPopulate()
        res.json(user)
    }

    /**
     * GET /users
     * Create a new member account
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public allUser = (req: Request, res: Response, next: NextFunction) => {
        res.send("you are in all users, rock and roll")
    }
}

export default UserController