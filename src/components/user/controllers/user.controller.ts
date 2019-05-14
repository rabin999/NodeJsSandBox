import { Request, Response, NextFunction } from "express"
import User from "../model/user.model"
import Designation from "../../designation/model/designation.model"
import DesignationNotFoundException from "../../../exceptions/DesignationNotFoundException"
import HttpException from "../../../exceptions/HttpException"
import UserNotFoundException from "../../../exceptions/UserNotFoundException"
import config from "../../../config"
import mongoose from "mongoose"

class UserController {

    /**
     * GET /users
     * Get all users
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public users = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const users = await User.find({}).select("-__v -owners").lean().exec()
            return res.json(users)
        }
        catch (error) {
            const err = new HttpException({
                status: 500,
                message: error.toString()
            })
            res.status(500).json(err.parse())
        }
    }

    /**
     * POST /signup
     * Create a new user account
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const fullname = req.body.fullname.trim()
            const { email, password, role, designation } = req.body
            const selectedDesingation = await Designation.findById(designation)

            if (selectedDesingation != null) {
                const user = await User.create({
                    fullname,
                    email,
                    password,
                    role,
                    designation: selectedDesingation.id,
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
    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const fullname = req.body.fullname.trim()
            const { email } = req.body

            // unlike admin, they are only allowed to change fullname and email fields
            let fields = {}
            if (req.user.role !== "admin") {
                fields = {
                    fullname,
                    email
                }
            } else {
                // if user is admin
                const { password, role, designation } = req.body
                const selectedDesingation = await Designation.findById(designation)

                if (selectedDesingation == null) {
                    const err = new DesignationNotFoundException(designation)
                    return res.status(404).json(err.parse())
                }

                fields = {
                    fullname,
                    email,
                    password,
                    role,
                    designation: selectedDesingation.id,
                }
            }

            const user = await User.findByIdAndUpdate(req.params.id, fields, { upsert: true })
            return res.json({ message: `User id ${user._id} updated successfully` })
            
        } catch (error) {
            const err = new HttpException({
                status: 500,
                message: error.toString()
            }) 
            res.status(500).json(err.parse())
        }
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