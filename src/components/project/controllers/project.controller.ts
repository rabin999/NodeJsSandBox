import { Request, Response, NextFunction } from "express"
import HttpException from "../../../exceptions/HttpException"
import ProjectNotFound from "../../../exceptions/ProjectNotFoundException"
import NotAuthorized from "../../../exceptions/NotAuthorizedException"
import Project from "../model/project.model"
// import mongoose, { mongo } from "mongoose"
import mongoose from "mongoose"
import multer from "multer"
import config from "../../../config"
import mimeTypes from "mime-types"
import path from "path"
import fs from "fs"
import rimraf from "rimraf"

class ProjectController {

    /**
     * GET /projects
     * Get all projects
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public projects = async (req: Request, res: Response, next: NextFunction) => {
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
     * GET /project/:id/logo
     * Get project logo
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public logo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId = req.params.id
            const project = await Project.findById(projectId).select("logo -_id").lean().exec()

            // Image not found
            if (!project.logo) {
                const err = new HttpException({
                    status: 404,
                    message: "Project logo not found."
                })
                return res.status(404).json(err.parse())
            }

            const UPLOAD_PATH = path.resolve(config.upload.projectLogo.dest + "/" + projectId)
            
            // Image file not found
            if (!fs.existsSync(path.join(UPLOAD_PATH, project.logo))) {
                const err = new HttpException({
                    status: 404,
                    message: "Project logo not found."
                })
                return res.status(404).json(err.parse())
            }

            // if mime exists set header
            const mimeType = mimeTypes.contentType(project.logo)
            if (mimeType)
                res.setHeader('Content-Type', mimeType);

            fs.createReadStream(path.join(UPLOAD_PATH, project.logo)).pipe(res)
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
     * PUT /:id/uploadLogo
     * Upload Project Logo
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public uploadLogo = async (req: Request, res: Response, next: NextFunction) => {

        try {
            
            const projectId = req.params.id
            let imageName = ""
            const uploadDir = path.resolve(config.upload.projectLogo.dest + "/" + projectId)
            const project = await Project.findById(projectId).lean().exec()

            // create folder if not exits
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true })
            }

            if (project.logo && fs.existsSync(path.join(uploadDir, project.logo))) {
                fs.unlinkSync(path.join(uploadDir, project.logo))                    
            }

            const storage = multer.diskStorage({
                destination: async (req, file, cb) => {
                    cb(null, path.resolve(uploadDir))
                },
                filename: (req, file, cb) => {
                    imageName = file.originalname
                    cb(null, imageName)
                }
            })

            const upload = multer({
                storage,
                limits: {
                    fileSize: 1024 * 1024 * config.upload.projectLogo.uploadSize
                },
                fileFilter: (req, file, cb) => {
                    // accept image only
                    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
                        cb(new Error('Only image files are allowed!'), false)
                    }
                    cb(null, true)
                }
            }).single('logo')

            upload(req, res, async function (error) {
                if (error) {
                    const err = new HttpException({
                        status: 500,
                        message: error.toString()
                    })
                    return res.status(500).json(err.parse())
                }
                
                if (!req.file) {
                    const err = new HttpException({
                        status: 404,
                        message: "Please select a logo"
                    })
                    return res.status(404).json(err.parse())
                }

                // update user profile image
                await Project.findByIdAndUpdate(projectId, { logo: imageName })

                res.send({
                    message: `Project id ${projectId} logo uploaded successfully.`
                })
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