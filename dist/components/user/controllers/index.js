"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { check, validationResult } from "express-validator"
/**
 * POST /signup
 * Create a new member account
 */
exports.singUp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    // const user = await User.create({
    //     fullname: "John Mayer",
    //     email: "john@gmail.com",
    //     password: "password@1",
    //     role: "project_manager",
    // })
    res.send("Hello signup user");
});
/**
 * GET /users
 * Create a new member account
 */
exports.allUser = (req, res, next) => {
    res.send("you are in all users");
};
