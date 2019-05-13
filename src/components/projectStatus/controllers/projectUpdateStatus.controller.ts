import { Request, Response, NextFunction } from "express"
import ProjectUpdate  from "../../projectUpdate/model/projectUpdate.model"
import HttpException from "../../../exceptions/HttpException"
// import ProjectUpdateNotFound from "../../../exceptions/m"
import mongoose from "mongoose"

class ProjectUpdateStatusController {

    /**
     * GET /project-status/projectUpdateId
     * Get all project status of project update id
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public projectUpdateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updates = await ProjectUpdate
                                .find({ project: mongoose.Types.ObjectId(req.params.projectUpdateId) }).select("scope")
                                .sort({ "_id": -1 })
                                .limit(5)
                                .lean().populate("status.ratedBy").exec()
                                
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
     * POST project-status/projectUpdateId/create
     * Add a new project update status
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public create = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const { rate, ratedBy } = req.body
            const newProjectStatus = await ProjectUpdate.findByIdAndUpdate(req.params.projectUpdateId, {
                $push: {
                    status: {
                        rate,
                        ratedBy
                    }
                }
            }, { upsert: true })

            return res.status(201).json({
                message: `Project Update status created successfully.`
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
     * DELETE project-status/id/delete
     * Delete project update status using project status id
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const deleteProjectUpdateStatus = await ProjectUpdate.findOneAndUpdate({ "status._id" : mongoose.Types.ObjectId(req.params.id) },
                { $pull: { status: { _id: mongoose.Types.ObjectId(req.params.id) } }},
                { upsert: true }
            ).exec()

            if (!deleteProjectUpdateStatus) {
                throw new Error(`Project update status id ${req.params.id} not found.`)
            }

            res.json({
                message: `Project Update status id ${req.params.id} deleted successfully.`
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

export default ProjectUpdateStatusController