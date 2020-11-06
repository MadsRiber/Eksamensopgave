require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const dbName = "Eksamensprojekt"



//Jeg kan nu lave routes
const userRoute = require("./Views/Routes/Users")

mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to DB"))
    
app.use(bodyParser.json());

app.use("/users", userRoute);
app.use(express.static("./Views"));


app.set("view-engine", "ejs");

app.get("/", function(req, res) {
    res.render("index.ejs")
})
/*app.get("/users", function(req, res){
    const db = client.db(dbName)
    const collection = db.collection("users")
    collection.find({}).toArray(function(err, users){
    assert.equal(err, null);
    res.render("homepage.ejs", {"users": users})
    });
      
})*/



app.listen(3000);