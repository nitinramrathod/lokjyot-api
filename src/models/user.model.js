const mongoose = require('mongoose');
const bcrypt = require("bcrypt");


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },  
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
    },  
    role: {
        type: String,
        enum:["admin", "publisher"],
        default: "publisher",
    },  
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
    },  
 
}, { timestamps: true })

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model("User", UserSchema);