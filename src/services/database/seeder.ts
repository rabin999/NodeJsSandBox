import bluebird from "bluebird"
import mongoose from "mongoose"
import config from "../../config"

class Seeder {
    constructor() {
        this.connectToDatabase()
    }

    /**
     * Connect to MongoDB
     */
    public connectToDatabase() {
        (<any>mongoose).Promise = bluebird

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
    private seed(): void {
        this.dashboardSeeder()
    }

    private dashboardSeeder(): void {
        // mongo insert code
    }
}

new Seeder();
