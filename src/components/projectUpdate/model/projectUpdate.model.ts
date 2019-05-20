import mongoose from "mongoose"

const projectUpdateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tasks: [{
        type: String,
        required: true 
    }],
    description: {
        type: String
    },
    remark:{
        type: String
    },
    seen: {
        type: Boolean,
        default: false,
        required: true
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
    status: [{
        rate: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            required: true
        },
        ratedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        ratedAt : {
            type: Date,
            default: Date.now
        }
    }]
}, { 
    timestamps: true
})

export default mongoose.model("projectUpdate", projectUpdateSchema)