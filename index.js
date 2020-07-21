const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

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
  description: String,
});
// Make the object model of this
const Campground = mongoose.model("Campground", campgroundSchema);

// Create a campground
// Campground.create(
//   {
//     name: "Newport State Park",
//     image:
//       "https://img-aws.ehowcdn.com/700x/cdn.onlyinyourstate.com/wp-content/uploads/2017/10/swirling-stars-above-lake-michigan-700x465.jpg",
//     description:
//       "Newport is Wisconsin's only wilderness-designated state park. In 2017, the International Dark-Sky Association named Newport a Dark-sky preserve.",
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

// INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { campgrounds: allCampgrounds });
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
  res.render("new");
});

// SHOW - shows additional info about one campground
//  this must be after '/campgrounds/new' otherwise it would treat 'new' as :id
app.get("/campgrounds/:id", (req, res) => {
  // find the campground with provided ID
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      // render show template with the campground
      res.render("show", { campground: foundCampground });
    }
  });
});

// Start server
app.listen(1000, function () {
  console.log("The CampWI server has started at localhost:1000!!!");
});
