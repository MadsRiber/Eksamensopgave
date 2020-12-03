const mongoose = require("mongoose");


//Laver min model for user, med mongoose.schema
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    city: String,
    interests: String,
    gender: Object,
    preferredGender: String,
    age: Number,
    likes: Array,
    matches: Array
});

userModel = mongoose.model("Users", userSchema);

module.exports = userModel;