"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const feedbackSchema = new mongoose_1.default.Schema({
    emoji: {
        type: String,
        required: true
    },
    project: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "project",
        required: true
    },
    client: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("feedback", feedbackSchema);
