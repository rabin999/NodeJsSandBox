"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const https = __importStar(require("https"));
const fs_1 = __importDefault(require("fs"));
class Server {
    constructor() {
        this.app = new app_1.default().app;
        this.listen();
    }
    /**
     * Start Express server
     */
    listen() {
        if (config_1.default.env === "production") {
            /**
             * https connection
            */
            https.createServer({
                key: fs_1.default.readFileSync("/etc/letsencrypt/live/yourdomain.com/privkey.pem"),
                cert: fs_1.default.readFileSync("/etc/letsencrypt/live/yourdomain.com/cert.pem"),
                ca: fs_1.default.readFileSync("/etc/letsencrypt/live/yourdomain.com/chain.pem"),
            }, this.app)
                .listen(config_1.default.port);
        }
        else {
            const server = this.app.listen(config_1.default.port, () => {
                console.log("App is running at http://localhost:%d in %s mode", config_1.default.port, config_1.default.env);
                console.log("Press CTRL-C to stop\n");
            });
        }
    }
}
new Server();
