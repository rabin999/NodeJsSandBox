"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProjectController {
    constructor() {
        /**
         * GET /projects
         * Create a new member account
         */
        this.projects = (req, res, next) => {
            res.send("you are in project page");
        };
    }
}
exports.default = ProjectController;
