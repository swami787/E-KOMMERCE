import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String
    },
    cartData: {
        type: Object,
        default: {}
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    googleId: String
}, { timestamps: true, minimize: false });

const User = mongoose.model("User", userSchema);

export default User;