"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "project_manager", "client"],
        required: true,
    },
    designation: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "designation",
        required: true
    }
}, {
    timestamps: true
});
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
