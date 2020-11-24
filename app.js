require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override")
const session = require("express-session")



//Jeg kan nu lave routes
const userRoute = require("./Views/Routes/Users");
const adminRoute = require("./Views/Routes/Admin");



mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to DB"));

    //forsøg på stay logged in
/*app.use(session({
        saveUninitialized: true,
        secret: 'secret',
        resave: true,
        cookie: {
          maxAge: 24 * 60 * 60 * 365 * 1000
        }
      }))*/
app.use(bodyParser.json());
app.use(methodOverride("_method"))
app.use("/users", userRoute);
app.use("/admin", adminRoute);
app.use(express.static("./Views/css/"));



app.set("view-engine", "ejs");

app.get("/", function(req, res) {
    res.render("index.ejs")
});

app.listen(3000);