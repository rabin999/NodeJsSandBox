import { Request, Response, NextFunction } from "express"
import ProjectUpdate  from "../model/projectUpdate.model"
import HttpException from "../../../exceptions/HttpException"
import ProjectUpdateNotFound from "../../../exceptions/ProjectUpdateNotFoundException"
import mongoose from "mongoose"

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
            const updates = await ProjectUpdate.find({ project: mongoose.Types.ObjectId(req.params.projectId ) }).select("-__v").exec()
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
            const { title, description, remark, project, pushedBy } = req.body
            const newUpdate = await ProjectUpdate.create({
                title,
                description,
                remark,
                project, 
                pushedBy
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
     * PUT /project-update/id/update
     * Update projectUpdate
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const { title, description, remark, project, pushedBy } = req.body
            const updated = await ProjectUpdate.findByIdAndUpdate( req.params.id, {
                title,
                description,
                remark,
                project, 
                pushedBy
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

            const deletedUpdate = await ProjectUpdate.findByIdAndDelete(req.params.id).exec()

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