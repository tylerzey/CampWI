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
  res.render("register", { page: "register" });
});

// Handle sign up logic
router.post("/register", (req, res) => {
  let newUser = new User({ username: req.body.username });
  if (req.body.adminCode === "guardianOfRum") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/register"); // if error, exit registration and re-display the register template
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to CampWI, " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// Show login form
router.get("/login", (req, res) => {
  res.render("login", { page: "login" });
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
  req.flash("success", "Successfully logged out!");
  res.redirect("/campgrounds");
});

module.exports = router;
