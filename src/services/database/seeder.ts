import bluebird from "bluebird"
import mongoose from "mongoose"
import config from "../../config"
import Designation from "../../components/designation/model/designation.model"

class Seeder {
    constructor () {
        this.connectToDatabase()
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
            console.log("Seeding...")
            this.seed()
            console.log("Seed Completed")
        })
        .catch(err => {
            console.log(`MongoDB connection error. Please make sure MongoDB is running ${err}`)
        })

        mongoose.set("useCreateIndex", true)
    }

    /**
     * All Seeder registered here
     */
    private seed() 
    {
        this.designationSeeder()
    }

    private designationSeeder () 
    {
        Designation.insertMany([
            {
                title: "Chief Executing Officier"
            },
            {
                title: "Director of Technology"
            },
            {
                title: "Technology Manager"
            },
            {
                title: "Project Manager"
            },
            {
                title: "Software Engineer"
            },
            {
                title: "Developer"
            },
            {
                title: "Designer"
            },
            {
                title: "Quality Control"
            }
        ])
    }
}

new Seeder()