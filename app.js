var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var app = express();

// var logger = function(req, res, next) {
//     console.log("Logging...");
//     next();
// }

// app.use(logger);

//View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Set static path
app.use(express.static(path.join(__dirname, "public")));

var users = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@aol.com"
  },
  {
    id: 2,
    first_name: "Marilyn",
    last_name: "Manson",
    email: "manson@aol.com"
  },
  {
    id: 3,
    first_name: "Tom",
    last_name: "Ford",
    email: "tom@aol.com"
  }
];

app.get("/", function(req, res) {
  res.render("index", {
    title: "Customers",
    users: users
  });
});

app.get("/users/add", function(req, res) {
  res.render("contact");
});

app.post("/users/add", function(req, res) {
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
