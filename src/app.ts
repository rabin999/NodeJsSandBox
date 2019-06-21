import express from "express"
import expressValidator from "express-validator"
import { Router, Request, Response, NextFunction } from "express"
import HttpException from "./exceptions/HttpException"
import session from "express-session"
import uuid from "uuid/v4"
import passport from "passport"
import compression from "compression"
import bodyParser from "body-parser"
import lusca from "lusca"
import cors from "cors"
import bluebird from "bluebird"
import mongoose from "mongoose"
import config from "./config"
import Routes from "./routes/v1"
import errorMiddleware from "./middleware/error.middleware"
import swaggerUI from "swagger-ui-express"

import swaggerJSON from "../documentation/swagger.json"

class App {

    public app: express.Application
    public routes: any

    constructor ()
    {
        this.app = express()
        this.routes = new Routes().route

        this.connectToDatabase()
        this.initializeMiddlewares()
        this.initializeErrorHandling()
        this.initializeRoutes()
    }

    /**
     * Connect to MongoDB
     */
    public connectToDatabase()
    {
        (<any>mongoose).Promise    = bluebird

        // ${config.database.usename}:${config.database.password}@
        const connectionUrl = `mongodb://${config.database.host}:${config.database.port}/${config.database.name}`;

        const connection = mongoose.connect(connectionUrl, {
            useNewUrlParser: true
        })
        .then(() => { })
        .catch(err => {
            console.log(`MongoDB connection error. Please make sure MongoDB is running ${err}`)
        })

        mongoose.set('useCreateIndex', true)
        mongoose.set('useFindAndModify', false)
    }

    /**
     * Express configuration
     */
    private initializeMiddlewares()
    {
        this.app.use(compression())
        // * express body parser
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
       /**
         * Security headers
         * 
         */
        this.app.use(lusca.xframe("SAMEORIGIN"))
        this.app.use(lusca.xssProtection(true))
        this.app.use(lusca.nosniff())
        this.app.use(lusca.csp({
            policy: {
                'default-src': config.csp_src ? `'self' ${config.csp_src}` : '*',
                'img-src': "*",
                'style-src': '*'
            }
        }))
        this.app.use(lusca.referrerPolicy('same-origin'))
        this.app.use(lusca.hsts({
            maxAge: 31536000,
            includeSubDomains: true
        }))
        this.app.disable('x-powered-by')

        this.app.use(expressValidator())
        this.app.use(cors({
            origin: config.cors_origin
        }))

        /**
         * Express seassion
         */
        this.app.use(session({
            genid: (req) => {
                return uuid()
            },
            resave: true,
            saveUninitialized: true,
            secret: config.session_secret,
        }))

        // Setup Passport below
    }

    private initializeErrorHandling()
    {
        this.app.use(errorMiddleware)
    }

    /**
     * Routes
     */
    private initializeRoutes()
    {
        this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON))
        // you can add your other urls here
        this.app.use("/api/v1", this.routes)
    }
}

export default App
