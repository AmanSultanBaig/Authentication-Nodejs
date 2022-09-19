const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    facebookId: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "user"
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("users", UserSchema)