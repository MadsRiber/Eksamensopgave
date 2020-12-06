//Henter alle de ting jeg skal bruge
const express = require("express");
const router = express.Router();
const User = require("../../Models/Users.js");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: true }));
router.use(express.static("../css"));

//Signup-form
router.post("/signup", (req, res) => {
  //Ser efter om der allerede er en bruger med den ønskede email
  User.find({ email: req.body.email })

    .then((Users) => {
      //Hvis der ikke er en bruger, laves der er ny
      if (Users.length < 1) {
        const newUser = new User({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          city: req.body.city,
          interests: req.body.interests,
          gender: req.body.gender,
          preferredGender: req.body.preferredGender,
          age: req.body.age,
        });
        //Ny bruger gemmes
        newUser.save()

          .then((user) => {

            //Finder alle de bruger, som ikke er den bruger man er logget ind med, så jeg kan vise dem igennem min EJS fil.
            User.find({ email: { $ne: req.body.email } })
            
            .then((listUsers) => {

              //require flash, så jeg senere kan bruge det.
              req.flash("message", null);

              //Kode til at vise en tilfældig bruger som possible match
              var random = Math.floor(Math.random() * listUsers.length);

              res.status(200).render("homepage.ejs", {
                  user: user,
                  listUsers: listUsers[random],
                  message: req.flash("message"),
                });
            });
          })

          .catch((err) => {
            if (err) {
              res.status(500).json({ error: err });

            } else {
              res.status(404).json({ error: "Error" });
            }
          });

      } else {
        res.status(404).json({ message: "User already exists" });
      }
    })

    .catch((err) => {
      if (err) {
        res.status(500).json({ message: "error" });
      }
    });
});

router.post("/login", (req, res) => {
  //Checker om en bruger eksisterer med den email, der forsøges at logges ind med
  if (req.body.email != null) {
    User.find({ email: req.body.email })

      .then((users) => {
        if (users < 1) {
          res.status(404).json({ error: "Not and existing user" });
        }

        //Checker om password er korrekt
        if (users[0].password == req.body.password) {
          User.find({ email: { $ne: req.body.email } })

          .then((listUsers) => {
            req.flash("message", null);
            var random = Math.floor(Math.random() * listUsers.length);

            res.status(200).render("homepage.ejs", {
                user: users[0],
                listUsers: listUsers[random],
                message: req.flash("message"),
              });
          });

        } else {
          res.status(404).json({ message: "Unauthorized" });
        }
      })

      .catch((err) => {
        if (err) {
          res.status(500).json({ error: err });

        } else {
          res.status(404).json({ error: "Error" });
        }
      });
  }
});

//Delete funktionalitet
router.delete("/login/delete/:id", async (req, res) => {
  let user;

  try {
    user = await User.findById(req.params.id);
    await user.remove();
    res.redirect("/");

  } catch {
    if (user == null) {
      res.redirect("/");

    } else {
      res.redirect(`/users/login/${user.id}`);
    }
  }
});

//Update
router.post("/update", (req, res) => {
  var updatedUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    city: req.body.city,
    interests: req.body.interests,
    gender: req.body.gender,
    preferredGender: req.body.preferredGender,
    age: req.body.age,
  };

  User.updateOne({ _id: req.body.id }, { $set: updatedUser })

    .then((result) => {
      res.redirect("http://localhost:3000");
    })

    .catch((err) => {
      if (err) {
        res.status(500).json({ error: err });

      } else {
        res.status(404).json({ error: "Error" });
      }
    });
});


router.get("/login/:id/edit", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("edit.ejs", { user: user });

  } catch {
    res.redirect("/users/login");
  }
});

router.get("/logout", function (req, res, next) {
  res.redirect("/");
});

router.post("/:id/likes", async (req, res) => {
  likesUpdated = req.body.id;

  await User.updateOne(
    { _id: req.params.id },
    { $addToSet: { likes: likesUpdated } }
  );

  const done = await User.findOne({ _id: req.body.id });

  let myArray = done.likes;
  matchesUpdated = req.body.id;

  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i] == req.params.id && req.body.id == likesUpdated) {

      req.flash("message", "You have a new match!");
      await User.updateOne(
        { _id: req.params.id },
        { $addToSet: { matches: matchesUpdated } }
      );

      await User.updateOne(
        { _id: req.body.id },
        { $addToSet: { matches: req.params.id } }
      );

      break;
    }
  }

  User.findOne({ _id: req.params.id })

    .then((user) => {
      User.find({ _id: { $ne: req.params.id } })

        .catch((err) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            res.status(404).json({ error: "Error" });
          }
        })

        .then((listUsers) => {
          var random = Math.floor(Math.random() * listUsers.length);
          res.status(200).render("homepage.ejs", {
              user: user,
              listUsers: listUsers[random],
              message: req.flash("message"),
            });
        });
    })

    .catch((err) => {
      if (err) {
        res.status(500).json({ error: err });

      } else {
        res.status(404).json({ error: "Error" });
      }
    });
});

router.get("/:id/matches", async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  const matches = await User.find({ _id: { $in: user.matches } });

  res.render("matches.ejs", { matches: matches, user: user });
});

router.post("/:id/matches/delete", async (req, res) => {
  const user1 = await User.findOne({ _id: req.params.id });
  const user2 = await User.findOne({ _id: req.body.id });

  let myArray = user1.matches;
  let myArray1 = user2.matches;

  //Ekstra sikkerhed for, at tjekke man har fat i den rigtige bruger
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i] == req.body.id) {

      await User.updateOne(
        { _id: req.params.id },
        { $pull: { matches: req.body.id } }
      );

      await User.updateOne(
        { _id: req.body.id },
        { $pull: { matches: req.params.id } }
      );

      await User.updateOne(
        { _id: req.params.id },
        { $pull: { likes: req.body.id } }
      );
      break;
    }
  }

  res.redirect("/");
});

module.exports = router;
