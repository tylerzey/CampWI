// Require our data models
const Campground = require("../models/campground"),
  Comment = require("../models/comment");

// All required middleware
const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to submit a campground or comment.");
  // Need to declare this before a redirect
  res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  // Is user logged in
  if (req.isAuthenticated()) {
    // is this user the creator/owner of the campground?
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        // check for errors or null data objects since !null === true
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
    req.flash("error", "You need to be logged in to submit a campground or comment.");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  // Is any user logged in
  if (req.isAuthenticated()) {
    // is this user the creator/owner of the comment?
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
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
    req.flash("error", "You need to be logged in to submit a campground or comment.");
    res.redirect("back");
  }
};

module.exports = middlewareObj;
