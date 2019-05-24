import bcrypt from "bcrypt-nodejs"
import mongoose from "mongoose"
import Project from "../../project/model/project.model"

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    fireBaseToken: [{
        type: String,
        unique: true
    }],
    passwordResetToken: String,
    passwordResetExpiresAt: Date,
    token: {
        accessToken: String,
        refreshToken: String,
        expiresAt: Date,
        scopes: Array
    },
    role: {
        type: String,
        enum: ["admin", "projectManager", "client", "member"],
        required: true,
    },
    designation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "designation",
        required: true
    }
}, { 
    timestamps: true
})

/**
 * --------------
 * HOOKS
 * --------------
 */

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
    const user = this;
    if (!user.isModified("password")) { return next() }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err) }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) { return next(err) }
            user.password = hash
            next()
        })
    })
})

/**
 * Remove all associated relational IDs
 */
userSchema.post("remove", user => {
    const userId = user._id;
    Project.find({ members: { $in: [ mongoose.Types.ObjectId(userId) ] } }).then(projects => {
        projects.map(project =>
            Project.findOneAndUpdate(
                project._id,
                { $pull: { members: userId } },
                { new: true }
            )
        )
    })

    Project.find({ owners: { $in: [ mongoose.Types.ObjectId(userId) ] } }).then(projects => {
        projects.map(project =>
            Project.findOneAndUpdate(
                project._id,
                { $pull: { owners: userId } },
                { new: true }
            )
        )
    })
})

/**
 * Compare password function type
 * 
 * @param  {string} plainPassword
 * @param  {(err:any,isMatch:any)=>{}} cb
 */
type comparePasswordFunction = (plainPassword: string, cb: (err: any, isMatch: any) => {}) => void

/**
 * Compare password
 * 
 * @param  {} plainPassword
 * @param  {} cb
 */
const comparePassword: comparePasswordFunction = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch)
    })
}
userSchema.methods.comparePassword = comparePassword;

export default mongoose.model("user", userSchema)