import mongoose from "mongoose"

const projectUpdateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    remark:{
        type: String
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: true
    },
    pushedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
}, { 
    timestamps: true
})

export default mongoose.model("projectUpdate", projectUpdateSchema)