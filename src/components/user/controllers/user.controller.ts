import { Request, Response, NextFunction } from "express"
import User  from "../model/user.model"
import Designation from "../../designation/model/designation.model"
import DesignationNotFoundException from "../../../exceptions/DesignationNotFoundException"

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

        const fullname = req.body.fullname.trim()
        const { email, password, confirmPassword, role, designation } = req.body

        try {
            const selectedDesingation = await Designation.findById(designation)

            if (selectedDesingation != null) {
                const user = await User.create({
                    fullname,
                    email,
                    password,
                    role,
                    designation: selectedDesingation.id
                })
                
                const newUser = await user.populate("designation").execPopulate()
                res.json(newUser)
            } else {
                next(new DesignationNotFoundException(designation))
            }
            
        } catch (error) {
            res.status(500).json(error)
        }
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