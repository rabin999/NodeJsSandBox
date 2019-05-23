import { Request, Response, NextFunction } from "express"
import HttpException from "../../../exceptions/HttpException"
import User from "../../user/model/user.model"
import UserNotFound from "../../../exceptions/UserNotFoundException"
import randomstring from "randomstring"
import moment from "moment"
import config from "../../../config"
import nodemailer from "nodemailer"
import bcrypt from "bcrypt-nodejs"
import aws from "aws-sdk"
import path from "path"

class ProjectController {

    /**
     * POST /forgetPassword
     * Send new password reset link to user mail
     */
    public forgetPassword = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const { mail } = req.body

            if (!mail) {
                const err = new HttpException({
                    status: 422,
                    message: "User mail address is required"
                })
                return res.status(422).json(err.parse())
            }

            const user = await User.findOne({ email: mail }).lean().exec()
            if (!user) {
                const err = new UserNotFound(mail)
                return res.status(404).json(err.parse())
            }

            const resetToken = randomstring.generate(mail)
            const resetTokenExpiresAt = moment().add(24, 'hours')
            const link = config.app_host + ":" + config.port + "/resetPassword/" + resetToken


            // Send Message
            let transporter

            // for ses
            if (config.ses_service) {
                aws.config.loadFromPath(path.resolve("/home/ubuntu/Fusemachines-fuse-bulletin/dist/components/password/controllers/config/ses.json"))
                transporter = nodemailer.createTransport({
                    SES: new aws.SES({
                        apiVersion: '2010-12-01'
                    }),
                    logger: true
                })
            } else {
                transporter = nodemailer.createTransport({
                    service: config.email.gmail.provider,
                    auth: {
                        user: config.email.gmail.username,
                        pass: config.email.gmail.password
                    },
                    logger: true
                })
            }

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: `"${config.app_name}" <${config.ses_service.enabled ? config.ses_service.from : config.email.gmail.username}>`, // sender address
                to: mail, // list of receivers
                subject: "Request for password reset", // Subject line
                text: `Click here to reset your password ${link}.This token will be expire after 24 hours, Thank you !`
            })
            
            // update user
            await User.findOneAndUpdate({ email: mail }, {
                passwordResetToken: resetToken,
                passwordResetExpiresAt: resetTokenExpiresAt
            })

            res.send(info)
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
     * PUT /resetPassword
     * Update user new password
     */
    public resetPassword = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const user = await User.findOne({ passwordResetToken: req.params.token, passwordResetExpiresAt: { $gt: moment() } }).lean().exec()

            if (user == null) {
                const err = new HttpException({
                    status: 400,
                    message: "Token could be expired or not found."
                })
                return res.status(400).json(err.parse())
            }

            // update user
            const salt = bcrypt.genSaltSync(10)
            await User.findOneAndUpdate({ passwordResetToken: req.params.token }, {
                passwordResetToken: "",
                passwordResetExpiresAt: "",
                password: bcrypt.hashSync(req.body.password, salt)
            })

            res.send({
                message: `User ${user.fullname} password changed successfully.`
            })
        }
        catch (error) {
            const err = new HttpException({
                status: 500,
                message: error.toString()
            })
            res.status(500).json(err.parse())
        }
    }
}

export default ProjectController