import { NextFunction, Request, Response } from "express"
import HttpException from "../exceptions/HttpException"
import Unauthorized from "../exceptions/NotAuthorizedException"

const roleMiddleware = (roles: Array<String>, options: object = {}) => {
    return (request: Request, response: Response, next: NextFunction) {
        if (request.user.role === "admin" || roles.includes(request.user.role)) {
            next()
        }
        else {
            return response.status(403).send(new Unauthorized().parse())
        }
    }
}
  
export default roleMiddleware