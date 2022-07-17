const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    }
})

module.exports = mongoose.model("UserModel", userSchema)
