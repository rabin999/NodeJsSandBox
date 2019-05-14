import { Request, Response, NextFunction } from "express"
import ProjectUpdate  from "../model/projectUpdate.model"
import HttpException from "../../../exceptions/HttpException"
import ProjectUpdateNotFound from "../../../exceptions/ProjectUpdateNotFoundException"
import mongoose from "mongoose"
import Unauthorized from "../../../exceptions/NotAuthorizedException"

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
                findCondition = { project: mongoose.Types.ObjectId(req.params.projectId), pushedBy : req.user._id }
            } else {
                findCondition = { project: mongoose.Types.ObjectId(req.params.projectId) }
            }

            const updates = await ProjectUpdate.find(findCondition).select("-__v").lean().exec()
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
     * POST /project-updates/create
     * Create a new project update
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public create = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const { title, description, remark, project } = req.body

            const newUpdate = await ProjectUpdate.create({
                title,
                description,
                remark,
                project, 
                pushedBy: req.user._id
            })

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

            const updated = await ProjectUpdate.findByIdAndUpdate( req.params.id, {
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
                findCondition = { _id: mongoose.Types.ObjectId(req.params.id), pushedBy : req.user._id }
            } else {
                findCondition = { _id: mongoose.Types.ObjectId(req.params.id), }
            }

            const { title, description, remark, project } = req.body
            const updated = await ProjectUpdate.findByIdAndUpdate( findCondition, {
                title,
                description,
                remark
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
                findCondition = { _id: mongoose.Types.ObjectId(req.params.id), pushedBy : req.user._id }
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