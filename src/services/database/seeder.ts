import bluebird from "bluebird"
import mongoose from "mongoose"
import config from "../../config"
import Designation from "../../components/designation/model/designation.model"
import ProjectType from "../../components/projectTypes/model/projectType.model"
import User from "../../components/user/model/user.model"
import Project from "../../components/project/model/project.model"

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
    private seed(): void
    {
        this.designationSeeder()
        this.projectTypeSeeder()
    }

    private designationSeeder () : void
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

    private projectTypeSeeder () : void
    {
        ProjectType.insertMany([
            {
                title: "Machine Learning"
            },
            {
                title: "Artificial Intelligence"
            },
            {
                title: "Mobile Developmet"
            },
            {
                title: "Web Development"
            }
        ])
    }
}

new Seeder()