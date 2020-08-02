// Add in Express router
const Campground = require("../models/campground"),
  passport = require("passport"),
  Comment = require("../models/comment"),
  express = require("express"),
  router = express.Router(),
  User = require("../models/user");

// Root Route path
router.get("/", (req, res) => {
  res.render("landing");
});

//=================
// AUTH ROUTES
//=================

// Show register form
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle sign up logic
router.post("/register", (req, res) => {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register"); // if error, exit registration and re-display the register template
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds");
    });
  });
});

// Show login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Handling Login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

// LOGOUT Route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

// Middleware function for logged-in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
