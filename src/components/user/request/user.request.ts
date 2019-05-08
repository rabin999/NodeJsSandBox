import { check } from "express-validator/check"
import { Request, Response, NextFunction } from "express"

const validation = (req: Request, res: Response, next: NextFunction) => {
    
    // Fullname
    req.assert("fullname").exists()
        .not().isEmpty().withMessage("Fullname required")
        .isLength({ min: 5 }).withMessage("Fullname must be 5 characters")

    // Role
    req.assert("role").notEmpty().withMessage("Role required").isIn(["admin", "project_manager", "client"]).withMessage("Given role is not valid.")

    // Email
    req.assert("email", "Email is not valid").isEmail()

    // Password
    req.assert("password").notEmpty().withMessage("Password required")

    // Password
    req.assert("confirmPassword").equals(req.body.password).withMessage("Password doesn't match")

    // Designation
    req.assert("designation").notEmpty().withMessage("Designation required")

    // process errors
    const errors = req.validationErrors();
    if (errors) {
        return res.status(422).send(errors)
    } else {
        next()
    }    
}

export default validation