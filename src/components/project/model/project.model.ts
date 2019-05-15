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
        required: true,
    }],
    owners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    projectType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projectType",
    },
    endDate: Date,
    detail: String
}, { 
    timestamps: true
})

projectSchema.virtual("totalMembers", {
    ref: "user",
    localField: "members",
    foreignField: "_id",
    count: true
})

projectSchema.virtual("newUpdates", {
    ref: "projectUpdate",
    localField: "_id",
    foreignField: "project",
    options: {
        match: { seen: true }
    },
    count: true
})

projectSchema.virtual("recentUpdate", {
    ref: "projectUpdate",
    localField: "_id",
    foreignField: "project",
    options: {
        limit: 1,
        sort: { _id : -1 },
        match: { seen: true }
    }
})

export default mongoose.model("project", projectSchema)