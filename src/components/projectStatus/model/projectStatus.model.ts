import mongoose from "mongoose"

const projectStatusSchema = new mongoose.Schema({
    rate: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    update: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projectUpdate",
        required: true
    },
    ratedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    rate_time: {
        type: Date,
        required: true
    }
}, { 
    timestamps: true
})

export default mongoose.model("projectSchema", projectStatusSchema)