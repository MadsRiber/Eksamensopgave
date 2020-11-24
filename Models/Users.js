const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    city: String,
    interests: String,
    gender: Object,
    preferredGender: String,
    dob: Date,
    likes: Array
});

userModel = mongoose.model("Users", userSchema);

module.exports = userModel;