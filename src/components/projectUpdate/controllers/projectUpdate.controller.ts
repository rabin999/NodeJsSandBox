import { Request, Response, NextFunction } from "express"
import ProjectUpdate from "../model/projectUpdate.model"
import HttpException from "../../../exceptions/HttpException"
import NotAuthorized from "../../../exceptions/NotAuthorizedException"
import ProjectUpdateNotFound from "../../../exceptions/ProjectUpdateNotFoundException"
import mongoose from "mongoose"
import * as firebaseAdmin from "firebase-admin"
import User from "../../user/model/user.model"
import Project from "../../project/model/project.model"
import { pluck } from "../../../services/parser/Pluck"
// @ts-ignore: Resolve json module
import serviceAccount from "../../../../fuse-bulletin-7e087-firebase-adminsdk-h8k1f-c1a5791a9d.json"
import NotificationController from "../../notification/controllers/notification.controller"

class ProjectUpdateController {

    /**
     * GET project-updates/id
     * Get all project updates of projectID
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public projectUpdates = async (req: Request, res: Response, next: NextFunction) => {
        try {

            let findCondition = {}
            if (req.user.role !== "admin" && req.user.role === "projectManager") {
                findCondition = { 
                    project: mongoose.Types.ObjectId(req.params.projectId), 
                    pushedBy: req.user._id
                }
            } 
            else if(req.user.role === "admin") {
                findCondition = { project: mongoose.Types.ObjectId(req.params.projectId) }
            }
            else if(req.user.role === "client") {
                findCondition = { project: mongoose.Types.ObjectId(req.params.projectId) }
            } 
            else {
                const err = new NotAuthorized()
                return res.status(500).json(err.parse())
            }

            const updates = await ProjectUpdate.find(findCondition, 
                { 
                    tasks: { $slice: -1 }, 
                    status: { 
                        $elemMatch: { ratedBy: mongoose.Types.ObjectId(req.user._id) } 
                    } 
                }
                ).select("-__v").lean().exec()
                
            return res.json({
                data: updates
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
    * GET project-updates/:projectId/filter/:month
    * Get all project updates filter using month
    * 
    * @param  {Request} req
    * @param  {Response} res
    * @param  {NextFunction} next
    */
    public filterProjectUpdate = async (req: Request, res: Response, next: NextFunction) => {
        try {

            let findCondition = {}
            if (req.user.role !== "admin" && req.user.role === "projectManager") {
                findCondition = { project: mongoose.Types.ObjectId(req.params.projectId), pushedBy: req.user._id, $month: req.params.month }
            } else {
                findCondition = { project: mongoose.Types.ObjectId(req.params.projectId), $month: req.params.month }
            }

            // * working
            const updates = await ProjectUpdate.aggregate([
                {
                    $match: findCondition
                }
            ]).exec()

            return res.json(updates)
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
    * GET project-updates/:id/details
    * Get all project updates filter using month
    * 
    * @param  {Request} req
    * @param  {Response} res
    * @param  {NextFunction} next
    */
   public detail = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const updates = await ProjectUpdate.findById(req.params.id).populate({
                            path: "status.ratedBy",
                            model: "user",
                            select: ["fullname", "role", "designation"],
                            populate: {
                                path: "designation",
                                model: "designation",
                                select: ["title"]
                            }
                        }).lean().exec()

        return res.json({
            data: updates
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
     * Send Notification to clients
     * 
     * @param  {string} token
     * @param  {any} option
     */
    public sendNotificationAndSave = async (tokens: string[], option: any) => {

        if (!tokens.length) {
            throw new Error("Firebase token not found.")
        }

        // setup firebase admin
        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert(serviceAccount),
            databaseURL: "https://fuse-bulletin-7e087.firebaseio.com"
        })

        const payload = {
            notification: {
                title: option.title,
                projectUpdateId: option.projectUpdateId,
                type: option.type,
                description: option.description,
            },
            tokens
        }   
            
        // send notification
        const firebaseReponse = await firebaseAdmin.messaging().sendMulticast(payload)
        
        // saving notification
        await new NotificationController().save({
            title: option.title,
            projectUpdateId: option.projectUpdateId,
            type: option.type,
            description: option.description,
            tokens
        })
        
        // saving token
        return firebaseReponse
    }
    
    /**
     * POST /project-updates/create
     * Create a new project update
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { title, description, remark, project, tasks } = req.body

            const newUpdate = await ProjectUpdate.create({
                title,
                description,
                remark,
                project,
                tasks: tasks,
                pushedBy: req.user._id
            })

            // get project owners to send notification
            let userIds= await Project.findById(project).select("owners").lean().exec()
            if (userIds && userIds.owners) {

                // all project owners
                userIds = userIds.owners.map((ownerId: string | number) => mongoose.Types.ObjectId(ownerId))
                let fireBaseTokens = await User.find({
                    '_id': { $in: userIds }
                }).select("fireBaseToken -_id").lean().exec()

                // pluck fireBaseToken from reponse
                const tokens = pluck(fireBaseTokens, "fireBaseToken", true)

                const payload = {
                    title,
                    projectUpdateId: newUpdate._id,
                    type: "update",
                    description
                }

                // // send notification
                this.sendNotificationAndSave(tokens, payload)
            }

            return res.status(201).json({
                message: `Project Update ${newUpdate.title} created successfully.`
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
     * POST /project-update/id/seen/true
     * Change project update seen status
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public updateSeen = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const updated = await ProjectUpdate.findByIdAndUpdate(req.params.id, {
                seen: true
            })

            if (!updated) {
                const err = new ProjectUpdateNotFound(req.params.id)
                return res.status(404).json(err.parse())
            }

            return res.json({
                message: `Project Update ${updated.title} seen status changed successfully.`
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
     * PUT /project-update/id/update
     * Update projectUpdate
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {

            let findCondition = {}
            if (req.user.role !== "admin" && req.user.role === "projectManager") {
                findCondition = { _id: mongoose.Types.ObjectId(req.params.id), pushedBy: req.user._id }
            } else {
                findCondition = { _id: mongoose.Types.ObjectId(req.params.id), }
            }

            const { title, description, remark, tasks } = req.body
            const updated = await ProjectUpdate.findByIdAndUpdate(findCondition, {
                title,
                description,
                remark,
                tasks
            })

            if (!updated) {
                const err = new ProjectUpdateNotFound(req.params.id)
                return res.status(404).json(err.parse())
            }

            return res.json({
                message: `Project Update ${updated.title} updated successfully.`
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
     * DELETE /project-updates/id/delete
     * Delete project update
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {

            let findCondition = {}
            if (req.user.role !== "admin" && req.user.role === "projectManager") {
                findCondition = { _id: mongoose.Types.ObjectId(req.params.id), pushedBy: req.user._id }
            } else {
                findCondition = { _id: mongoose.Types.ObjectId(req.params.id), }
            }

            const deletedUpdate = await ProjectUpdate.findOneAndDelete(findCondition).exec()

            if (!deletedUpdate) {
                const err = new ProjectUpdateNotFound(req.params.id)
                return res.status(404).json(err.parse())
            }

            res.json({
                message: `Project Update "${deletedUpdate.title}" deleted successfully.`
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

export default ProjectUpdateController