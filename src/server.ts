import App from "./app"
import config from "./config"
import * as https from "https"
import fs from "fs"
import express from "express"

class Server {

    public app : any

    constructor () 
    {
        this.app = new App().app
        this.listen()
    }

    /**
     * Start Express server
     */
    private listen() 
    {
        if (config.env === "production") {
            /**
             * https connection
            */
            https.createServer({
                key: fs.readFileSync("/etc/letsencrypt/live/yourdomain.com/privkey.pem"),
                cert: fs.readFileSync("/etc/letsencrypt/live/yourdomain.com/cert.pem"),
                ca: fs.readFileSync("/etc/letsencrypt/live/yourdomain.com/chain.pem"),
              }, this.app)
              .listen(config.port)
        } 
        else {
            const server = this.app.listen(config.port, () => {
                console.log(
                    "App is running at http://localhost:%d in %s mode",
                    config.port,
                    config.env
                )
                console.log("Press CTRL-C to stop\n")
            })
        }
    }
}

new Server()


