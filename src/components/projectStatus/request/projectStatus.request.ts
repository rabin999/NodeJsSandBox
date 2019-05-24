import { Request, Response, NextFunction } from "express"
import HttpException from "../../../exceptions/HttpException"


const validation = async (req: Request, res: Response, next: NextFunction) => {
    
    // Project Status title
    req.assert("rate").notEmpty().withMessage("Rating is required.").isIn(["1", "2", "3"]).withMessage("Given rate is not valid.")

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