const express = require("express");
const router = express.Router();
const Admin = require("../../Models/Admin.js");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended: true}));

router.post("/", (req, res) => {

Admin.find({email: req.body.email})
.then(admins => {

    if(admins < 1) {

        res.status(404).json({error: "No admins"});
    }
    if (admins[0].password == req.body.password) {
        res.status(200).render("admin.ejs");
    } else {
        res.status(404).json({message: "Unauthorized"});
    }
})
.catch(err => {
        if(err) {
            res.status(500).json({error: err});
        } else {
            res.status(404).json({error: "Error"});
        }
    });
});

module.exports = router;