import { Request, Response, NextFunction } from "express"
import HttpException from "../../../exceptions/HttpException"
import ProjectNotFoundException from "../../../exceptions/ProjectNotFoundException"
import Project from "../model/project.model"

class ProjectController {
    
    /**
     * GET /projects
     * Create a new member account
     */
    projects = (req: Request, res: Response, next: NextFunction) => {
        res.json("you are in project page")
    }

    /**
     * POST /signup
     * Create a new project
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public create = async (req: Request, res: Response, next: NextFunction) => {

        const { title, logo, description, members, owners, projectType, endDate, detail } = req.body

        try {
            const newProject = await Project.create({
                title,
                logo,
                description,
                members,
                owners,
                projectType,
                endDate,
                detail
            })
            res.status(201).json({
                message: `Project ${newProject.title} created successfully.`
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
     * PUT /:id/update
     * Update Project
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public update = async (req: Request, res: Response, next: NextFunction) => {

    }

    /**
     * DELETE /:id/delete
     * Delete Project
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public delete = async (req: Request, res: Response, next: NextFunction) => {

    }
}

export default ProjectController