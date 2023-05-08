const express = require("express");
const cors = require("cors");
const app = express();
require("./config/database");
require("dotenv").config();
require("./config/passport");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("./models/User");

const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userController = require("./controllers/userController");

app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
    // cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// base url
app.get("/", (req, res) => {
  res.render("index");
});

//get register page
app.get("/register", (req, res) => {
  res.render("register");
});

//post register
app.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      res.status(400).json("User already exists");
    }

    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      const newUser = await User({
        username: req.body.username,
        password: hash,
      });
      await newUser.save();
      res.status(201).redirect("/login");
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  next();
};

// login : get
app.get("/login", checkLoggedIn, (req, res) => {
  res.render("login");
});

//   login post
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "profile",
  })
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// profile protected route
app.get("/profile", checkAuthenticated, (req, res) => {
  res.render("profile", { username: req.user.username });
});

// logout route
app.get("/logout", (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update user
app.post("/update-user/:id", async (req, res) => {
  const updateUser = await User.findOne({ _id: req.params.id });
  updateUser.username = req.body.username;
  await updateUser.save();
  res.json(updateUser);
});

// Show all user
app.get("/users", userController.allUsers);

module.exports = app;
