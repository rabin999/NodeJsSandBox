import winston from "winston";
import { createLogger } from "winston";
import config from "../config"

const logger = createLogger({
    transports: [
        new (winston.transports.Console)({ level: config.env === "production" ? "error" : "debug" }),
        new (winston.transports.File)({ filename: "debug.log", level: "debug"})
    ]
});

if (config.env !== "production") {
    logger.debug("Logging initialized at debug level");
}

export default logger;