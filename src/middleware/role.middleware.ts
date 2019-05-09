import { NextFunction, Request, Response } from "express"
import HttpException from "../exceptions/HttpException"

function roleMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {

    /**
     * Parse JSON Syntax error
     */
    if (error instanceof SyntaxError) {

      const status = 500
      const message = error.message

      response.status(status).send(new HttpException({
        status,
        message
      }).parse())

    } else {

      const status = error.params.status || 500
      const message = error.message || "Something went wrong"

      response.status(status).send({
          message,
          status,
      })

    }
  }
  
  export default roleMiddleware