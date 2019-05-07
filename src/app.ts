import express from "express"
import compression from "compression"
import bodyParser from "body-parser"
import lusca from "lusca"
import cors from "cors"
import bluebird from "bluebird"
import mongoose from "mongoose"
import config from "./config"
import Routes from "./routes/v1"
import errorMiddleware from "./middleware/error.middleware"
import Seeder from "./services/database/seeder"

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
        .then(() => { 
            
            /**
             * Run Seeder
             */
            if (config.seed)
                new Seeder()

        })
        .catch(err => {
            console.log(`MongoDB connection error. Please make sure MongoDB is running ${err}`)
        })
        
        mongoose.set('useCreateIndex', true)
    }

    /**
     * Express configuration
     */
    private initializeMiddlewares()
    {
        this.app.use(compression())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(lusca.xframe("SAMEORIGIN"))
        this.app.use(lusca.xssProtection(true))
        this.app.use(cors())
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
        this.app.use("/api/v1", this.routes)
    }
}

export default App