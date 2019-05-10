import { Request, Response, NextFunction } from "express"
import HttpException from "../../../exceptions/HttpException"


const validation = async (req: Request, res: Response, next: NextFunction) => {
    
    // Project Status title
    req.assert("title").notEmpty().withMessage("Project Type title is required")
        .isLength({ min: 5 }).withMessage("Project Type title must be 5 characters")

    // Project status description
    req.assert("description").notEmpty().withMessage("Description is required")

    // Project status's project
    req.assert("project").notEmpty().withMessage("Project ID is required")

    // Project status pushed by
    req.assert("pushedBy").notEmpty().withMessage("Project stauts pushedId is required")

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