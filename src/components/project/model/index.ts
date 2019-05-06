import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    projectType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projectType",
        required: true
    },
}, { 
    timestamps: true
})

export default mongoose.model("project", projectSchema)