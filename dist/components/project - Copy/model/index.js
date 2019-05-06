"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const projectSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
    description: {
        type: String,
    },
    members: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "user",
            required: true
        }],
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    projectType: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "projectType",
        required: true
    },
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("project", projectSchema);
