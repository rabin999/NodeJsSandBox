import bluebird from "bluebird"
import mongoose from "mongoose"
import config from "../../config/index"

(<any>mongoose).Promise    = bluebird
const connectionUrl = `mongodb://${config.database.usename}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.name}`

const connection = mongoose.connect(connectionUrl, {
    useNewUrlParser: true
})

export default connection
