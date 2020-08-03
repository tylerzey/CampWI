// Require our data models
const Campground = require("../models/campground"),
  Comment = require("../models/comment");

// All required middleware
const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to submit."); // won't display until the next page we see
  // Need to declare this before a redirect
  res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  // Is user logged in
  if (req.isAuthenticated()) {
    // is this user the creator/owner of the campground?
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        // check error
        req.flash("error", "Well, this is awkward. We cannot find that campground. :/");
        res.redirect("back");
      } else {
        // is user the creator of this campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          // if not, redirect
          req.flash("error", "You need to be the campground creator to edit or delete.");
          res.redirect("back");
        }
      }
    });
  } else {
    // If not, redirect
    req.flash("error", "You need to be logged in to submit.");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  // Is any user logged in
  if (req.isAuthenticated()) {
    // is this user the creator/owner of the comment?
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        // check for & handle any query error
        req.flash("error", "Well, this is awkward. We cannot find that comment. :/");
        res.redirect("back");
      } else {
        // is user the creator of this comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          // if not, redirect back
          req.flash("error", "You need to be the comment creator to edit or delete.");
          res.redirect("back");
        }
      }
    });
  } else {
    // If not, redirect back
    req.flash("error", "You need to be logged in to submit.");
    res.redirect("back");
  }
};

module.exports = middlewareObj;
