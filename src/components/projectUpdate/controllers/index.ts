import { Request, Response, NextFunction } from "express"
// import Project  from "../model"

/**
 * GET /projects
 * Create a new member account
 */
export const projects = (req: Request, res: Response, next: NextFunction) => {
    res.send("you are in project page")
}