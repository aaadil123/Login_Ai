const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim: true,
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    }
})

module.exports = mongoose.model("User", userSchema);