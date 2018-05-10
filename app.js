var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var exphbs = require("express-handlebars");
var app = express();
var router = express.Router();
var portfolio = require("./model/porfolio-card");

// var logger = function(req, res, next) {
//     console.log("Logging...");
//     next();
// }

// app.use(logger);

//bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//View Engine
// app.use(routes);
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Set static path
// app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
  var hbsObject = {
    sites: portfolio
  };
  res.render("index", hbsObject);
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.post("/contact", function(req, res) {
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

  // This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
  var auth = {
    auth: {
      api_key: "key-06e6b46b102891f53f5cf330e362d73f",
      domain: "sandbox72d77368bbd542999a0d11c99d26b570.mailgun.org"
    }
  };

  var nodemailerMailgun = nodemailer.createTransport(mg(auth));

  nodemailerMailgun.sendMail(
    {
      from: "myemail@example.com",
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
    function(err, info) {
      if (err) {
        console.log("Error: " + err);
      } else {
        console.log("Response: " + info);
      }
    }
  );
});

app.listen(8080, function() {
  console.log("Server Started on port 8080");
});
