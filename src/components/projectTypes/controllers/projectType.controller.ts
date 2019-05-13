import { Request, Response, NextFunction } from "express"
import HttpException from "../../../exceptions/HttpException"
import ProjectTypeNotFoundException from "../../../exceptions/ProjectTypeNotFoundException"
import ProjectType from "../model/projectType.model"

class ProjectController {

    /**
     * GET /project-types
     * Get all project types
     */
    allProjectTypes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allProjectTypes = await ProjectType.find({}).select("-__v").lean().exec()
            return res.json(allProjectTypes)
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
     * POST /project-types/create
     * Create a new project type
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public create = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const newProjectType = await ProjectType.create({
                title: req.body.title
            })
            return res.status(201).json({
                message: `Project type ${newProjectType.title} created successfully.`
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
     * DELETE project-types/id/delete
     * Delete project type
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public delete = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const deletedProjectType = await ProjectType.findByIdAndDelete(req.params.id).exec()

            if (!deletedProjectType) {
                const err = new ProjectTypeNotFoundException(req.params.id)
                res.status(404).json(err.parse())
            } 

            res.json({
                message: `Project Type ${deletedProjectType.title} deleted successfully.`
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