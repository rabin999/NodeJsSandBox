import mongoose from "mongoose"

const designationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
}, { 
    timestamps: true
})

export default mongoose.model("designation", designationSchema)