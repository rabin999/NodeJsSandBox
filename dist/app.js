"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const lusca_1 = __importDefault(require("lusca"));
const cors_1 = __importDefault(require("cors"));
const bluebird_1 = __importDefault(require("bluebird"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const v1_1 = __importDefault(require("./routes/v1"));
class App {
    constructor() {
        this.app = express_1.default();
        this.routes = new v1_1.default().route;
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }
    /**
     * Connect to MongoDB
     */
    connectToDatabase() {
        mongoose_1.default.Promise = bluebird_1.default;
        // ${config.database.usename}:${config.database.password}@
        const connectionUrl = `mongodb://${config_1.default.database.host}:${config_1.default.database.port}/${config_1.default.database.name}`;
        const connection = mongoose_1.default.connect(connectionUrl, {
            useNewUrlParser: true
        })
            .then(() => { })
            .catch(err => {
            console.log(`MongoDB connection error. Please make sure MongoDB is running ${err}`);
        });
    }
    /**
     * Express configuration
     */
    initializeMiddlewares() {
        this.app.use(compression_1.default());
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(lusca_1.default.xframe("SAMEORIGIN"));
        this.app.use(lusca_1.default.xssProtection(true));
        this.app.use(cors_1.default());
    }
    /**
     * Routes
     */
    initializeRoutes() {
        this.app.use("/api/v1", this.routes);
    }
}
exports.default = App;
