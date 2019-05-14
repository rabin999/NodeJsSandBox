import { Request, Response, NextFunction } from "express"
import HttpException from "../../../exceptions/HttpException"
import ProjectNotFound from "../../../exceptions/ProjectNotFoundException"
import Unauthorized from "../../../exceptions/NotAuthorizedException"
import Project from "../model/project.model"
// import mongoose, { mongo } from "mongoose"
import mongoose from "mongoose"


class ProjectController {

    /**
     * GET /projects
     * Create a new member account
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    projects = async (req: Request, res: Response, next: NextFunction) => {
        try {

            let findCondition = {}
            if (req.user.role !== "admin" && req.user.role === "projectManager") {
                findCondition = { "members" : mongoose.Types.ObjectId(req.user._id) }
            }

            const allProjects = await Project.find(findCondition)
                                        .populate("projectType", "title")
                                        .populate("countMembers")
                                        .select("-__v -owners").lean().exec()

            return res.json(allProjects)
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
                createdBy: req.user._id,
                endDate,
                detail
            })
            res.status(201).json({
                message: `Project ${newProject.title} created successfully.`
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
     * PUT /:id/update
     * Update Project
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public update = async (req: Request, res: Response, next: NextFunction) => {
        const { title, logo, description, members, owners, projectType, endDate, detail } = req.body

        try {
            const updateProject = await Project.findByIdAndUpdate(req.params.id, {
                title,
                logo,
                description,
                members,
                owners,
                projectType,
                endDate,
                detail
            }, { new: true }).exec()

            if (!updateProject) {
                throw new Error("Problem with updating project !")
            }

            res.status(201).json({
                message: `Project ${updateProject.title} updated successfully.`
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
     * DELETE /:id/delete
     * Delete Project
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deletedProject = await Project.findByIdAndDelete(req.params.id).exec()

            if (!deletedProject) {
                throw new Error("Problem with deleting project !")
            }

            res.json({
                message: `Project ${deletedProject.title} deleted successfully.`
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
     * PUT /:id/add-member
     * Add new member to project
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public addMembers = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const ids: string = req.body.members
            const idsExists = Array.from(ids).filter(i => !!i.length)

            if (!idsExists.length) {
                throw new Error("Member shouldn't be empty.")
            }

            let membersId = typeof req.body.members === "string" ? [mongoose.Types.ObjectId(ids)] :
                                    Array.from(ids).map(id => mongoose.Types.ObjectId(id))
        
            const updateProject = await Project.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(req.params.id),
                    $nin: membersId
                },
                { $push: { members: { $each: membersId } } },
                { upsert: true }
            ).exec()

            if (!updateProject) {
                throw new HttpException({
                    status: 500,
                    title: "Error occured while updating project",
                    message: "Project not found or project members are already assigned to this project."
                })
            }

            res.status(201).json({
                message: `Members ${membersId} added to Project ${updateProject.title} successfully.`
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
     * PUT /:id/remove-member
     * Remove member from project
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public removeMembers = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const ids: string = req.body.members
            const idsExists = Array.from(ids).filter(i => !!i.length)

            if (!idsExists.length) {
                throw new Error("Member shouldn't be empty.")
            }

            let membersId: mongoose.Types.ObjectId[] = typeof req.body.members === "string" ? [mongoose.Types.ObjectId(ids)] :
                                    Array.from(ids).map(id => mongoose.Types.ObjectId(id))


            const updateProject = await Project.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(req.params.id), 
                    members: { 
                        $in: membersId
                    }
                },
                { $pull: { members: { $in: membersId } } },
                { upsert: true }
            ).exec()


            if (!updateProject) {
                throw new Error("Problem with updating project !")
            }

            res.status(201).json({
                message: `Members ${membersId.pop()} removed from Project ${updateProject.title} successfully.`
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

    public addOwners = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const ids : string | string[] = req.body.owners
            const idsExists = Array.from(ids).filter(i => !!i.length)

            if (!idsExists.length) {
                throw new Error("Owners id should not be emtpy")
            }

            let ownersId = typeof ids === "string" ? [mongoose.Types.ObjectId(ids)] :
                            Array.from(ids).map(id => mongoose.Types.ObjectId(id))

            const updateProject = await Project.findOneAndUpdate(
                {   _id: mongoose.Types.ObjectId(req.params.id), 
                    owners: { $nin: ownersId },
                },
                { $push: { owners: { $each: ownersId } } },
                { upsert: true }
            ).exec()

            if (!updateProject) {
                throw new Error("Problem with adding project owners !")
            }

            res.status(201).json({
                message: `Owners ${ownersId} added to Project ${updateProject.title} successfully.`
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

    public removeOwners = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const ownersId :string = typeof req.body.owners === "string" ? [req.body.owners] : req.body.owners
            const idsExists = Array.from(ownersId).filter(i => !!i.length)

            if (!idsExists.length) {
                throw new Error("Owners id should not be emtpy.")
            }

            const updateProject = await Project.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(req.params.id),
                owners: { $in: ownersId },
            },
                { $pull: { owners: { $in: ownersId } } },
                { upsert: true }
            ).exec()

            if (!updateProject) {
                throw new Error("Problem with updating project !")
            }

            res.status(201).json({
                message: `Owners ${ownersId} removed from Project ${updateProject.title} successfully.`
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