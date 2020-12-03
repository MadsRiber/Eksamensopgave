const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Madsriber:Telefon6@cluster0.w4j7y.mongodb.net/Eksamensprojekt?retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to DB"));