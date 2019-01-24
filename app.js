var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var exphbs = require("express-handlebars");
var app = express();

// var router = express.Router();
var portfolio = require("./model/porfolio-card");
require('dotenv').config();

// bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// View Engine
// app.use(routes);
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// load in the handlebars variable
app.get("/", function (req, res) {
  var hbsObject = {
    sites: portfolio
  };
  res.render("index", hbsObject);
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.post("/contact", function (req, res) {
  res.render("contact");
  var newUser = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  };
  console.log(newUser);

  // Nodemailer Mailgun Setup
  var nodemailer = require("nodemailer");
  var mg = require("nodemailer-mailgun-transport");

  var auth = {
    auth: {
      api_key: process.env.API_KEY,
      domain: process.env.DOMAIN
    }
  };

  var nodemailerMailgun = nodemailer.createTransport(mg(auth));

  nodemailerMailgun.sendMail(
    {
      from: "inquiry@jaredgip.in",
      to: "jared.gilpin@gmail.com", // An array if you have multiple recipients.
      subject: "New inquiry from " + newUser.name,
      //You can use "html:" to send HTML email content. It's magic!
      html:
        "New message from " +
        newUser.name +
        " (" +
        newUser.email +
        ")" +
        "<br><br>" +
        newUser.message
    },
    function (err, info) {
      if (err) {
        console.log("Error: " + err);
      } else {
        console.log("Response: " + info);
      }
    }
  );
});

app.listen(8080, function () {
  console.log("Server Started on port 8080");
});
