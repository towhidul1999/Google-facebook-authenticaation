require("dotenv").config();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const newUser = new User({
            googleId: profile.id,
            username: profile.displayName,
          });
          await newUser.save();
          return cb(null, newUser);
        }
        return cb(null, user);
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compare(password, user.password)) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (error) {
      return done(err);
    }
  })
);

// create session id
// whenever we login it creares user id inside session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// find session info using session id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
