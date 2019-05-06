import mongoose from "mongoose"

const feedbackSchema = new mongoose.Schema({
    emoji: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
}, { 
    timestamps: true
})

export default mongoose.model("feedback", feedbackSchema)