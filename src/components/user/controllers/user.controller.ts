import { Request, Response, NextFunction } from "express"
import User from "../model/user.model"
import Designation from "../../designation/model/designation.model"
import DesignationNotFoundException from "../../../exceptions/DesignationNotFoundException"
import HttpException from "../../../exceptions/HttpException"
import NotAuthorized from "../../../exceptions/NotAuthorizedException"
import UserNotFoundException from "../../../exceptions/UserNotFoundException"
import multer from "multer"
import config from "../../../config"
import mimeTypes from "mime-types"
import path from "path"
import fs from "fs"
import removeDir from "../../../services/fs/removeDir"

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
     * GET /users/:id/profile
     * Get user profile picture
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public profile = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const profile = await User.findById(req.params.id).select("image").lean().exec()
            const mimeType = mimeTypes.contentType(profile)

            return res.json(profile)

            // res.setHeader('Content-Type', result.mimetype);
            // fs.createReadStream(path.join(UPLOAD_PATH, profile)).pipe(res);
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
     * Upload user profile picture
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public uploadProfile = async (req: Request, res: Response, next: NextFunction) => {
        
        // return res.send(path.resolve(config.upload.user.dest + "/" + req.user._id))
        if (req.user.role !== "admin" && req.user._id !== req.params.id) {
            const error = new NotAuthorized()
            return res.status(403).json(error.parse())
        }

        try {
            
            let imageName = ""
            const uploadDir = path.resolve(config.upload.user.dest + "/" + req.user._id)

            const user = await User.findById(req.params.id).lean().exec()

            // create folder if not exits
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive:true })
            } else {
                if (user.image) {
                    fs.unlinkSync(path.resolve(config.upload.user.dest + "/" + req.user._id + "/" + user.image))
                }
            }

            const storage = multer.diskStorage({
                destination: async (req, file, cb) => {
                    cb(null, path.resolve(config.upload.user.dest + "/" + req.user._id))
                },
                filename: (req, file, cb) => {
                    imageName = file.originalname
                    cb(null, imageName)
                }
            })

            const upload = multer({
                storage,
                limits: {
                    fileSize: 1024 * 1024 * config.upload.user.uploadSize
                },
                fileFilter: (req, file, cb) => {
                    // accept image only
                    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
                        cb(new Error('Only image files are allowed!'), false)
                    }
                    cb(null, true)
                }
            }).single('image')

            upload(req, res, async function (error) {
                if (error) {
                    const err = new HttpException({
                        status: 500,
                        message: error.toString()
                    })
                    return res.status(500).json(err.parse())
                }
                
                if (!req.file) {
                    const err = new HttpException({
                        status: 404,
                        message: "File Not Found"
                    })
                    return res.status(404).json(err.parse())
                }

                // update user profile image
                await User.findByIdAndUpdate(req.params.id, { image: imageName })

                res.send({
                    message: `User ${req.user.fullname} profile image uploaded successfully.`
                })
            })
        } catch (error) {
            const err = new HttpException({
                status: 500,
                message: error.toString()
            })
            res.status(500).json(err.parse())
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