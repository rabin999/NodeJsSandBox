"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = __importDefault(require("../components/user/routes/user.route"));
const project_route_1 = __importDefault(require("../components/project/routes/project.route"));
class BaseRoutes {
    constructor() {
        this._route = express_1.Router();
        this.initializeBaseRoutes();
    }
    initializeBaseRoutes() {
        this._route.use("/users", new user_route_1.default().route);
        this._route.use("/projects", new project_route_1.default().route);
    }
    get route() {
        return this._route;
    }
}
exports.default = BaseRoutes;
