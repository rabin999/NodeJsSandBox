import { Request, Response, NextFunction } from "express"
import HttpException from "../../../exceptions/HttpException"
import ProjectTypeNotFoundException from "../../../exceptions/ProjectTypeNotFoundException"
import Designation from "../model/designation.model"

class DesignationController {

    /**
     * GET /designations
     * Get all designation
     */
    allDesignations = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const designations = await Designation.find({}).select("-__v").exec()
            return res.json(designations)

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
     * POST /designations/create
     * Create a new designation
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public create = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const newDesignation = await Designation.create({
                title: req.body.title
            })
            return res.status(201).json({
                message: `Designation ${newDesignation.title} created successfully.`
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
     * Delete project type
     * 
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
    public delete = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const deletedDesignation = await Designation.findByIdAndDelete({ _id: req.params.id }).exec()

            if (!deletedDesignation) {
                throw new Error("Problem with deleting project !")
            }

            return res.json({ 
                message: `Designation id ${req.params.id} deleted successfully` 
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

export default DesignationController