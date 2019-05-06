import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    text: {
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

export default mongoose.model("comment", commentSchema)