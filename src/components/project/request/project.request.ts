import { Request, Response, NextFunction } from "express"
import HttpException from "../../../exceptions/HttpException"


const validation = async (req: Request, res: Response, next: NextFunction) => {
    
    // Project title
    req.assert("title").notEmpty().withMessage("Project title is required")
        .isLength({ min: 2 }).withMessage("Project title must be 2 characters")

    // Project Members
    req.assert("members").notEmpty().withMessage("Project members are required")

    // Project Owner
    req.assert("owners").notEmpty().withMessage("Project owners are required")

    // Project Type
    req.assert("projectType").notEmpty().withMessage("Project type is required")

    // End Date
    req.assert("endDate").notEmpty().withMessage("End date is required")

    // process errors
    const errors = req.validationErrors()
    
    if (errors) {
        const errs = new HttpException({
            status: 422, 
            message: errors
        })
        res.status(422).send(errs.parse())
    } else {
        next()
    }    
}

export default validation