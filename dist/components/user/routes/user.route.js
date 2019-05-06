"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
class UserRoutes {
    constructor() {
        this._route = express_1.Router();
        this._route.post("/signup", new user_controller_1.default().singUp);
        this._route.get("/", new user_controller_1.default().allUser);
    }
    get route() {
        return this._route;
    }
}
exports.default = UserRoutes;
