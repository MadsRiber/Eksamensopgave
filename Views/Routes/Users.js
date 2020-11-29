const express = require("express");
const router = express.Router();
const User = require("../../Models/Users.js");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended: true}));
router.use(express.static("../css"));




router.post("/signup", (req, res) => {

    User.find({email: req.body.email})
    .then(Users => {
        if(Users.length < 1){


const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    city: req.body.city,
    interests: req.body.interests,
    gender: req.body.gender,
    preferredGender: req.body.preferredGender,
    dob: req.body.dob
});

newUser.save()
.then(user => {
    if (user) {
        res.status(200).render("homepage.ejs", {user: user});
    } else {
        res.status(404).json({message: "couldn't create user"});
    }
})
.catch(err => {
    if(err) {
        res.status(500).json({error: err});
    } else {
        res.status(404).json({error: "Error"});
    }
});
}else{
    res.status(404).json({message: "User already exists"})
}
})
.catch(err =>{
    if(err) {
        res.status(500).json({message: "error"})
    }
})

});

router.post("/login", (req, res) => {
    
if (req.body.email != null){
    User.find({email: req.body.email})
    .then(users => {
    
        if(users < 1) {
    
            res.status(404).json({error: "Not and existing user"});
        }
        if (users[0].password == req.body.password) {
            User.find({email: {$ne: req.body.email} })
            .then(listUsers =>{
             var random = Math.floor(Math.random() * (listUsers.length))
            res.status(200).render("homepage.ejs", {user: users[0], "listUsers": listUsers[random]});

        /*if (users[0].password == req.body.password) {
            User.find({email: {$ne: req.body.email} })
            .then(listUsers =>{
            res.status(200).render("homepage.ejs", {user: users[0], "listUsers": listUsers});*/
        })}
        
        // Kode til at den viser en tilfældig User, og ikke bare alle
        /*if (users[0].password == req.body.password) {
            User.find({email: {$ne: req.body.email} })
            .then(listUsers =>{
             var random = Math.floor(Math.random() * (listUsers.length))
            res.status(200).render("homepage.ejs", {user: users[0], "listUsers": listUsers[random]});
        })} 
        
        
        */
        
        else {
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
    }
    });

    //Delete funktionalitet
router.delete("/login/delete/:id", async (req, res)=>{
    let user
    try{
        user = await User.findById(req.params.id)
        await user.remove()
        res.redirect("/")
    } catch{
        if(user == null){
            res.redirect('/')
        }else{
            res.redirect(`/users/login/${user.id}`)
            }
        }
    }
    
);

//Update
router.post("/update", (req, res) =>{
    var updatedUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    city: req.body.city,
    interests: req.body.interests,
    gender: req.body.gender,
    preferredGender: req.body.preferredGender,
    dob: req.body.dob}
    
    User.updateOne({_id: req.body.id}, {$set: updatedUser})
    .then(result =>{
        res.redirect("http://localhost:3000")
    }
).catch(err => {
    if(err) {
        res.status(500).json({error: err});
    } else {
        res.status(404).json({error: "Error"});
    }
})
});
// Update kode fra Mathias.


router.get("/login/:id/edit", async (req,res)=>{try{
    const user = await User.findById(req.params.id)
    res.render("edit.ejs", {user: user })
} catch {
        res.redirect("/users/login")
}

})




router.get('/logout', function(req, res, next) {
    res.redirect('/');
  });

router.post("/:id/likes", async (req, res) =>{
    likesUpdated ={
        likes: req.body.id
    }
    await User.updateOne({_id: req.params.id}, {$push: {"likes": likesUpdated}})

    await User.findOne(({_id: req.body.id}))
    
    
    //User.findOne(({_id: req.params.id}))
    .then(done =>{
        var likes = done.likes[0]["likes"]
        var likes2 = likesUpdated["likes"]

        if(req.body.id == likes2)
        console.log(req.body.id, likes, req.params.id, likes2)
        
        //for(var i = 0; i < likesUpdated.length, i++;)
        //if(likesUpdated == done.id)
        //    console.log(done,likesUpdated)   
        res.status(200).render("matches.ejs", {"done": done});
        /*for(var i = 0; i < likesUpdated.length; i++)
        if(i == listUsers.id)
        alert("Nice")*/
        //console.log(listUsers[0].id)
        //console.log(hej)
        //res.redirect("http://localhost:3000")
    }
).catch(err => {
    if(err) {
        res.status(500).json({error: err});
    } else {
        res.status(404).json({error: "Error"});
    }
})
    });

module.exports = router;