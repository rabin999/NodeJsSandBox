import { Request, Response, NextFunction } from "express"
import User  from "../model/user.model"
import Designation from "../../designation/model/designation.model"
import DesignationNotFoundException from "../../../exceptions/DesignationNotFoundException"
import HttpException from "../../../exceptions/HttpException"
import UserNotFoundException from "../../../exceptions/UserNotFoundException"
import config from "../../../config"

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

            let CurrentDate = new Date()
            CurrentDate.setMonth(CurrentDate.getMonth() + config.passport.token.expiresAt)

            if (selectedDesingation != null) {
                const user = await User.create({
                    fullname,
                    email,
                    password,
                    role,
                    designation: selectedDesingation.id,
                    token: {
                        accessToken: "c9d00552-a20f-472a-9a90-9d88265a3fb5",
                        refreshToken: "175bd640-2d27-44c9-a411-2f5b5e600a29",
                        expiresAt: CurrentDate
                    }
                })
                
                const newUser = await user.populate("designation").execPopulate()
                res.json(newUser)
            } else {
                const err = new DesignationNotFoundException(designation)
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
     * POST /id/upload-profile
     * Update member account
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public uploadProfile = (req: Request, res: Response, next: NextFunction) => {
        res.send("Upload user profile")
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
            const user = await User.findById(req.params.id)

            if (user != null) {
                await User.deleteOne({ _id: user._id })
                return res.json({ message: `User id ${req.params.id} deleted successfully` })
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
}

export default UserController