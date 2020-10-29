const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    city: String,
    interests: String,
    gender: String
});

userModel = mongoose.model("Users", userSchema);

module.exports = userModel;