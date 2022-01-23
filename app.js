//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
})

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
})

app.get("/login", function (req, res) {
  res.render("login");
})

app.get("/register", function (req, res) {
  res.render("register");
})

app.get("/secrets", function (req, res) {
  res.render("secrets");
})

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save(function (err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/secrets");
    }
  })
})

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    if(err) {
      console.log(err);
    } else {
      if(foundUser) {
        if(foundUser.password === password) {
          res.redirect("/secrets");
        } else {
          res.send("You have entered incorrect email ID or password!! Try Again. Or Click here to register");
        }
      } else {
        res.send("No user with such email ID exitsts. Re-enter correct email ID or kindly register.");
      }
    }
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
})
