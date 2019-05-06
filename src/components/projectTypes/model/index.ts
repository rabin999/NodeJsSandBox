import mongoose from "mongoose"

const projectTypeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
}, { 
    timestamps: true
})

export default mongoose.model("projectType", projectTypeSchema)