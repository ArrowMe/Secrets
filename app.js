//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const userModel = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
})

app.get("/login", function (req, res) {
    res.render("login");
})

app.get("/register", function (req, res) {
    res.render("register");
})

app.post("/register", function (req, res) {
    const newUser = new userModel({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function (err) {
        if(!err){
            res.render("secrets");
        }        
        else{
            res.render(err);
        }
    });
})

app.post("/login", function (req,res) {
    userModel.findOne({email: req.body.username}, function (err, foundItem) {
        if(!err){
            if(foundItem && foundItem.password === req.body.password){
                res.render("secrets");
            }
        }
        else{
            res.render(err);
        }
    })
})

app.listen(process.env.PORT | 3000, function (req, res) {
    console.log("Server is listening...");
})