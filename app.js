const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

require("dotenv").config(); 
const srvr = process.env.N1_KEY; 
const srvrCred = process.env.N1_SECRET;
const secret = process.env.ENC_SECRET;

mongoose.connect("mongodb+srv://"+srvr+":"+srvrCred+"@cluster0.iyod0tt.mongodb.net/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

//userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, found) {
        if (err) {
            console.log(err);
        } else {
            if (found) {
                bcrypt.compare(password, found.password, function(err, result) {
                    if (result === true) {
                        res.render("secrets");
                    }
                });
            }
        }
    })
});

app.listen(3000, function() {
    console.log("Server started on port 3000.");
});