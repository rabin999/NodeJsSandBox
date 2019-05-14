import { Request, Response, NextFunction } from "express"
import ProjectUpdate  from "../../projectUpdate/model/projectUpdate.model"
import HttpException from "../../../exceptions/HttpException"
import NotAuthorized from "../../../exceptions/NotAuthorizedException"
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
            
            // "project."
            let findCondition = {}
            switch(req.user.role) {
                case "admin":
                    findCondition = { _id: mongoose.Types.ObjectId(req.params.projectUpdateId) }
                    break;
                case "projectManager":
                    findCondition = { _id: mongoose.Types.ObjectId(req.params.projectUpdateId), pushedBy: mongoose.Types.ObjectId(req.user._id) }
                    break;
                case "client":
                    findCondition = { _id: mongoose.Types.ObjectId(req.params.projectUpdateId), "status.ratedBy": mongoose.Types.ObjectId(req.user._id) }
                    break;
                default:
                    const err = new NotAuthorized()
                    return res.status(500).json(err.parse())
                    break;
            }

            const updates = await ProjectUpdate
                                .find(findCondition).select("status")
                                .sort({ "_id": -1 })
                                .limit(5)
                                .populate("status.ratedBy").lean().exec()
                                
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
            const { rate } = req.body
            const newProjectStatus = await ProjectUpdate.findByIdAndUpdate(req.params.projectUpdateId, {
                $push: {
                    status: {
                        rate,
                        ratedBy: req.user._id
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

            const deleteProjectUpdateStatus = await ProjectUpdate.findOneAndUpdate(
                { "status._id" : mongoose.Types.ObjectId(req.params.id), pushedBy: mongoose.Types.ObjectId(req.user._id) },
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