import App from "./app"
import config from "./config"
import * as https from "https"
import fs from "fs"

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
    private listen(): void
    {
        if (config.env === "production") {
            /**
             * https connection
            */
            https.createServer({
                key: fs.readFileSync("/etc/letsencrypt/live/yourdomain.com/privkey.pem", "utf-8"),
                cert: fs.readFileSync("/etc/letsencrypt/live/yourdomain.com/cert.pem", "utf-8"),
                ca: fs.readFileSync("/etc/letsencrypt/live/yourdomain.com/chain.pem", "utf-8"),
              }, this.app)
              .listen(config.port)
        } 
        else {
            const server = this.app.listen(config.port, () => {
                console.log(
                    "App is running at %s:%d in %s mode",
                    config.app_host,
                    config.port,
                    config.env
                )
                console.log("Press CTRL-C to stop\n")
            })
        }
    }
}

new Server()


