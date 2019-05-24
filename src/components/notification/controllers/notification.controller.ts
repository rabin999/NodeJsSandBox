import { Request, Response, NextFunction } from "express"
import HttpException from "../../../exceptions/HttpException"
import NotAuthorized from "../../../exceptions/NotAuthorizedException"
import Notification from "../model/notification.model"
import mongoose from "mongoose"


class NotificationController {

    /**
     * GET /notifications
     * Get all notifications
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public notifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notifications = await Notification.find({}).lean().exec()
            return res.json({
                data: notifications
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
    
    /**
     * POST /notifications/save
     * Create a new project
     *
     * @param  {any} fields
     */
    public save = async (fields: any) => {

        const { title, projectUpdateId, description } = fields

         const newNotification = await Notification.create({
            title,
            projectUpdateId,
            description
        })

        return newNotification

    }
}

export default NotificationController