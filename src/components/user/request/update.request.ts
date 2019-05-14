import { Request, Response, NextFunction } from "express"
import User from "../model/user.model"
import UserEmailAlreadyExistsException from "../../../exceptions/UserEmailAlreadyExistsException"
import HttpException from "../../../exceptions/HttpException"
import NotAuthorized from "../../../exceptions/NotAuthorizedException"


const validation = async (req: Request, res: Response, next: NextFunction) => {

    // Fullname
    req.assert("fullname").exists()
        .not().isEmpty().withMessage("Fullname is required")
        .isLength({ min: 5 }).withMessage("Fullname must be 5 characters")

        // Email
    req.assert("email", "Email is not valid").isEmail()

    if (req.user.role === "admin") {

        // Role
        req.assert("role").notEmpty().withMessage("Role is required")
                        .isIn(["admin", "projectManager", "client"]).withMessage("Given role is not valid.")

        // Password
        req.assert("password").notEmpty().withMessage("Password is required")

        // Password
        req.assert("confirmPassword").equals(req.body.password).withMessage("Password doesn't match")

        // Designation
        req.assert("designation").notEmpty().withMessage("Designation is required")
    } else {
        if (req.user._id != req.params.id) {
            const errs = new NotAuthorized()
            return res.status(422).send(errs.parse())
        }
    }

    // process errors
    const errors = req.validationErrors()

    if (errors) {
        const errs = new HttpException({
            status: 422, 
            message: errors
        })
        return res.status(422).send(errs.parse())
    } else {
        next()
    }   

}

export default validation