import { Request, Response, NextFunction } from "express"
import HttpException from "../../../exceptions/HttpException"


const validation = async (req: Request, res: Response, next: NextFunction) => {

    // Password
    req.assert("password").notEmpty().withMessage("Password is required")
    
    // confirm password and compare password
    req.assert("confirmPassword").notEmpty().withMessage("confirmPassword password is required").equals(req.body.password).withMessage("Password doesn't match")

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