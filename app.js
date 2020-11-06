require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");




//Jeg kan nu lave routes
const userRoute = require("./Views/Routes/Users");
const adminRoute = require("./Views/Routes/Admin");

mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to DB"));
    
app.use(bodyParser.json());

app.use("/users", userRoute);
app.use("/admin", adminRoute);
app.use(express.static("./Views"));


app.set("view-engine", "ejs");

app.get("/", function(req, res) {
    res.render("index.ejs")
});

app.listen(3000);