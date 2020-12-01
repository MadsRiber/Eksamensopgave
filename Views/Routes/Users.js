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
        User.find({email: {$ne: req.body.email} })
            .then(listUsers =>{
             var random = Math.floor(Math.random() * (listUsers.length))
        res.status(200).render("homepage.ejs", {user: user, "listUsers": listUsers[random]});
    
    
})
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
    //FIKS DET HER SKOD OBJEKT
    likesUpdated ={
        likes: req.body.id
    }
    
    await User.updateOne({_id: req.params.id}, {$addToSet: {"likes": likesUpdated}})

    const done = await User.findOne({_id: req.body.id})
    
    
    //.then(done =>{
        let myArray = done.likes
        matchesUpdated = req.body.id
        
        for(let i = 0; i < myArray.length; i++){
            if(myArray[i].likes == req.params.id && req.body.id == likesUpdated.likes){

                await User.updateOne({_id: req.params.id}, {$addToSet: {"matches": matchesUpdated}})
                
                await User.updateOne({_id: req.body.id}, {$addToSet: {"matches": matchesUpdated}})

                console.log("virker")
                break;
            }
            else {
                console.log("virker ikke")
            }}
            

            User.findOne({_id: req.params.id})

            .then(user =>{
                
            User.find({_id: {$ne: req.params.id}})
                
            
                .catch(err => {
                    if(err) {
                        res.status(500).json({error: err});
                    } else {
                        res.status(404).json({error: "Error"});
                    }
                    })
            
            
            

            .then(listUsers =>{
             var random = Math.floor(Math.random() * (listUsers.length))
                res.status(200).render("homepage.ejs", {"user": user, "listUsers": listUsers[random]})
            
    
        })

    })
.catch(err => {
    if(err) {
        res.status(500).json({error: err});
    } else {
        res.status(404).json({error: "Error"});
    }
    })

});

router.get("/:id/matches", async (req,res) =>{

    const user = await User.findOne({_id: req.params.id})
    //for(let i = 0; i < user.matches; i++){
      const matches = await User.find({_id: {$in: user.matches}})
      console.log(matches)
    //}
    res.render("matches.ejs", {"matches": matches})
    //res.render("matches.ejs", {"matches": matches[0]})
})



module.exports = router;