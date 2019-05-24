import mongoose from "mongoose"

const notification = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    projectUpdateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projectUpdate",
        required: true
    },
    type: {
        type: String,
        required: true,
        default: "update"
    },
    tokens: [{
        type: String
    }],
    description: {
        type: String,
    }
}, { 
    timestamps: true
})

export default mongoose.model("notification", notification)