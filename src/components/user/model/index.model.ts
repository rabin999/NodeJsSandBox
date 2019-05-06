import bcrypt from "bcrypt-nodejs"
import crypto from "crypto"
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "designation",
        required: true
    }
}, { 
    timestamps: true
})

const User = mongoose.model("user", userSchema)
export default User