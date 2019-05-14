import { Request, Response, NextFunction } from "express"
import HttpException from "../../../exceptions/HttpException"


const validation = async (req: Request, res: Response, next: NextFunction) => {
    
    // Project update title
    req.assert("title").notEmpty().withMessage("Project update title is required")
        .isLength({ min: 5 }).withMessage("Project update title must be 5 characters")

    // Project update description
    req.assert("description").notEmpty().withMessage("Description is required")

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