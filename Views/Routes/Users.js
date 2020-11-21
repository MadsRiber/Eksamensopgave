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
            res.status(200).render("homepage.ejs", {user: users[0]});
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
    }
    });

    //Delete funktionalitet
router.delete("/login/:id", async (req, res)=>{
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

router.get("/login/:id/edit", async (req,res)=>{try{
    const user = await User.findById(req.params.id)
    res.render("edit.ejs", {user: user })
} catch {
        res.redirect("/users/login")
}

})

router.put('/login/update/:id', async (req, res) => {   
    let user
    try {
      user = await User.findById(req.params.id)
      await user.save()
      res.redirect("/login")
    } catch {
      if (user == null) {
        res.redirect('/')
      } else {
        res.render('users/login/edit', {
          user: user,
          errorMessage: 'Error updating user'
        })
      }
    }
  })


/*router.put("/login/:id", (req,res)=>{
    res.send("Update user " + req.params.id)
})*/

router.get('/logout', function(req, res, next) {
    res.redirect('/');
  });

module.exports = router;