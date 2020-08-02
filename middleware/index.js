// Require our data models
const Campground = require("../models/campground"),
  Comment = require("../models/comment");

// All required middleware
const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  // Is user logged in
  if (req.isAuthenticated()) {
    // is this user the creator/owner of the campground?
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        // check error
        res.redirect("back");
      } else {
        // is user the creator of this campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          // if not, redirect
          res.redirect("back");
        }
      }
    });
  } else {
    // If not, redirect
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
        res.redirect("back");
      } else {
        // is user the creator of this comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          // if not, redirect back
          res.redirect("back");
        }
      }
    });
  } else {
    // If not, redirect back
    res.redirect("back");
  }
};

module.exports = middlewareObj;
