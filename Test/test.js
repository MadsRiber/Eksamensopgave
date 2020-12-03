const app = require('../Views/Routes/Users')
const assert = require("assert")
const User = require("../Models/Users");
const mongoose = require("mongoose")


//https://www.youtube.com/watch?v=2oYtk83FZCA&ab_channel=TheNetNinja
//describe tests
describe('Check if user is saved', function(){

    //create tests
    it('Saves new user', function (done) {
        var user1 = new User({
            username: "Mads",
            password: "secret",
            email: "mads@gmail.com",
            city: "Lyngby",
            interests: "Fodbold, basket",
            gender: {"gender": "male"},
            preferredGender: "female",
            age: 19,
            likes: [],
            matches: []
        });
        user1.save().then(function(){
            assert(user1.isNew === false);
            done();
        })
        .catch(err =>{
            (done)
        })
    });

});