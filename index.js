const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

// let campgrounds = [
//   {
//     name: "Salmon Creek",
//     image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350",
//   },
//   {
//     name: "Newport State Park",
//     image:
//       "https://img-aws.ehowcdn.com/700x/cdn.onlyinyourstate.com/wp-content/uploads/2017/10/swirling-stars-above-lake-michigan-700x465.jpg",
//   },
//   {
//     name: "Mountain Goat's Rest",
//     image: "https://pixabay.com/get/53e3d5414851aa14f1dc84609620367d1c3ed9e04e507440702d78d59745c6_340.jpg",
//   },
// ];

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

// SCHEMA SET-UP: Set up base/default data schema
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
});
// Make the object model of this
const Campground = mongoose.model("Campground", campgroundSchema);

// Create a campground
// Campground.create(
//   {
//     name: "Newport State Park",
//     image:
//       "https://img-aws.ehowcdn.com/700x/cdn.onlyinyourstate.com/wp-content/uploads/2017/10/swirling-stars-above-lake-michigan-700x465.jpg",
//   },
//   (err, campground) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Newly create campground!");
//       console.log(campground);
//     }
//   }
// );

// Route path
app.get("/", (req, res) => {
  res.render("landing");
});

// Campgrounds route
app.get("/campgrounds", (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds", { campgrounds: allCampgrounds });
    }
  });
});

// Allow new campgrounds to be added in
app.post("/campgrounds", (req, res) => {
  // get data from form and add to campgrounds array
  let name = req.body.name;
  let img = req.body.image;
  let newCampground = { name: name, image: img };
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

// the route to display the form TO THEN post
app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

// Start server
app.listen(1000, function () {
  console.log("The CampWI server has started at localhost:1000!!!");
});
