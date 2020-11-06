const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    email: String,
    password: String
});

adminModel = mongoose.model("Admin", adminSchema);
module.exports = adminModel;