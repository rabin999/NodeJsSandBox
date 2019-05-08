import { Request, Response, NextFunction } from "express"
import User from "../model/user.model"
import UserEmailAlreadyExistsException from "../../../exceptions/UserEmailAlreadyExistsException"
import HttpException from "../../../exceptions/HttpException"
import ExpressValidator from "express-validator"


const validation = async (req: Request, res: Response, next: NextFunction) => {
    
    // Fullname
    req.assert("fullname").exists()
        .not().isEmpty().withMessage("Fullname required")
        .isLength({ min: 5 }).withMessage("Fullname must be 5 characters")

    // Role
    req.assert("role").notEmpty().withMessage("Role required").isIn(["admin", "project_manager", "client"]).withMessage("Given role is not valid.")

    // Email
    req.assert("email", "Email is not valid").isEmail()

    // Check user email already exists ot not
    try {
        const user = await User.findOne({ email: req.body.email })

        if (user != null) {
            const errors = new UserEmailAlreadyExistsException(user.id)
            res.status(400).json(errors.parse())
        }
    } catch (error) {
        const err = new HttpException({
            status: 500,
            message: error.toString()
        })

        res.status(500).json(err.parse())
    }
    

    // Password
    req.assert("password").notEmpty().withMessage("Password required")

    // Password
    req.assert("confirmPassword").equals(req.body.password).withMessage("Password doesn't match")

    // Designation
    req.assert("designation").notEmpty().withMessage("Designation required")

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