import { Request, Response, NextFunction } from "express"
import User  from "../model/user.model"
import Designation from "../../designation/model/designation.model"
import DesignationNotFoundException from "../../../exceptions/DesignationNotFoundException"
import HttpException from "../../../exceptions/HttpException"
import UserNotFoundException from "../../../exceptions/UserNotFoundException"

class UserController {

    /**
     * POST /signup
     * Create a new user account
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public create = async (req: Request, res: Response, next: NextFunction) => {

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
     * PUT /id/update
     * Update member account
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public update = (req: Request, res: Response, next: NextFunction) => {
        res.send("Update User")
    }

    /**
     * DELETE /id/delete
     * Delete user account 
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userExists(req.params.id)

            if (user != null) {
                await User.deleteOne({ _id: user._id })
                return res.json({ message: "User deleted successfully" })
            } else {
                const err = new UserNotFoundException(req.params.id)
                return res.status(404).json(err.parse())
            }
        } catch (error) {
            const err = new HttpException({
                status: 500,
                message: error.toString()
            }) 
            res.status(500).json(err.parse())
        }
    }

    /**
     * @param  {string} userId
     */
    private userExists(userId : string)
    {
        return User.findOne({ _id: userId })
    }
}

export default UserController