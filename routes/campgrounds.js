// Add in Express router
const Campground = require("../models/campground"),
  middleware = require("../middleware"),
  Comment = require("../models/comment"),
  express = require("express"),
  router = express.Router();

//===================
// CAMPGROUND ROUTES
//===================
// INDEX - show all campgrounds
router.get("/", (req, res) => {
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
router.post("/", middleware.isLoggedIn, (req, res) => {
  // get data from form and add to campgrounds array
  let name = req.body.name;
  let img = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username,
  };
  let newCampground = { name: name, image: img, author: author, description: desc };
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
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("./campgrounds/new");
});

// SHOW - shows additional info about one campground
//  this must be after '/campgrounds/new' otherwise it would treat /'campgrounds'/'new' as :id
router.get("/:id", (req, res) => {
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

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  // Find and update the correct campground
  Campground.findOneAndUpdate({ _id: req.params.id }, req.body.campground, (err, updatedCampground) => {
    if (err) {
      res.redirect("back");
    } else {
      // Redirect somewhere -- typically to the SHOW page of that campground
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY CAMPGROUND ROUTE
// router.delete("/:id", (req, res) => {
//   Campground.findByIdAndRemove(req.params.id, (err) => {
//     if (err) {
//       res.redirect("/campgrounds/" + req.params.id);
//     } else {
//       res.redirect("/campgrounds/");
//     }
//   });
// });
// NEWER SYNTAX FOR DESTROY CAMPGROUND (& associated comments) ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
  try {
    let foundCampground = await Campground.findById(req.params.id);
    await foundCampground.remove();
    res.redirect("/campgrounds");
  } catch (error) {
    console.log(error.message);
    res.redirect("/campgrounds/" + req.params.id);
  }
});

module.exports = router;
