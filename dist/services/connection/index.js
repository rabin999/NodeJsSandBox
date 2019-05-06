"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("../../config/index"));
mongoose_1.default.Promise = bluebird_1.default;
const connectionUrl = `mongodb://${index_1.default.database.usename}:${index_1.default.database.password}@${index_1.default.database.host}:${index_1.default.database.port}/${index_1.default.database.name}`;
const connection = mongoose_1.default.connect(connectionUrl, {
    useNewUrlParser: true
});
exports.default = connection;
