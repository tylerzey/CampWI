const campground = require("./models/campground");

const express = require("express"),
  app = express(),
  seedDB = require("./seeds"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  // SCHEMA SET-UP: Set up base/default data schema
  Campground = require("./models/campground"),
  Comment = require("./models/comment");

// Connect (or create new DB) for mongoose to interact with MongoDB
mongoose
  .connect("mongodb://localhost:27017/camp_wi", {
    // need to use the localhost port of 27017 since our local instance of Mongo runs/listens here
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to 'camp_wi' DB!"))
  .catch((error) => console.log(error.message));

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
// set default view files to be ".ejs"
app.set("view engine", "ejs");
// Seed the database AFTER app configuration
seedDB();

// SETTING UP ROUTES

// Route path
app.get("/", (req, res) => {
  res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("./campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - add new campground to DB
app.post("/campgrounds", (req, res) => {
  // get data from form and add to campgrounds array
  let name = req.body.name;
  let img = req.body.image;
  let desc = req.body.description;
  let newCampground = { name: name, image: img, description: desc };
  // Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // Redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

// NEW - show form to create new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("./campgrounds/new");
});

// SHOW - shows additional info about one campground
//  this must be after '/campgrounds/new' otherwise it would treat /'campgrounds'/'new' as :id
app.get("/campgrounds/:id", (req, res) => {
  // find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        // render show template with the campground
        res.render("./campgrounds/show", { campground: foundCampground });
      }
    });
});

//=================
// COMMENTS ROUTES
//=================

// INDEX - Comments
app.get("/campgrounds/:id/comments/new", (req, res) => {
  // Find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      // pass through campground data object
      res.render("./comments/new", { campground: campground });
    }
  });
});

// CREATE - Comments
app.post("/campgrounds/:id/comments", (req, res) => {
  // Lookup campground using ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds"); // eventually change to show a true comment
    } else {
      // create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          // redirect TO CAMPGROUND SHOW PAGE
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// Start server
app.listen(1000, function () {
  console.log("The CampWI server has started at localhost:1000!!!");
});
