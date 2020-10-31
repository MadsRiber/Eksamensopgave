require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const bodyParser = require("body-parser");


//Jeg kan nu lave routes
const userRoute = require("./Views/Routes/Users")

mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to DB"))
    
app.use(bodyParser.json());

app.use("/users", userRoute);

app.get("/", (req,res)=>{
    res.send("");
});


app.listen(3000);