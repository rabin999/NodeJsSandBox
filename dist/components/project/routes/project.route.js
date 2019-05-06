"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = __importDefault(require("../controllers/project.controller"));
class ProjectRoutes {
    constructor() {
        this._route = express_1.Router();
        this._route.get("/", new project_controller_1.default().projects);
    }
    get route() {
        return this._route;
    }
}
exports.default = ProjectRoutes;
