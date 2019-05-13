import { NextFunction, Request, Response } from "express"
import HttpException from "../exceptions/HttpException"
import winston from "winston";
import { createLogger } from "winston";
import config from "../config"

const logger = createLogger({
  transports: [
      new (winston.transports.Console)({ level: config.env === "production" ? "error" : "debug" }),
      new (winston.transports.File)({ filename: "debug.log", level: "debug"}),
      new (winston.transports.File)({ filename: "error.log", level: "error"})
  ]
});


function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {

    if (config.env !== "production") {
      logger.debug(error.toString());
    } else {
      logger.error(error.toString());
    }

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
  
  export default errorMiddleware