const LocalStrategy = require("passport-local"),
  Campground = require("./models/campground"), // SCHEMA SET-UP: Set up base/default data schema
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  Comment = require("./models/comment"), // SCHEMA SET-UP: Set up base/default data schema
  express = require("express"),
  seedDB = require("./seeds"),
  User = require("./models/user"),
  app = express();

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
// serve the "public" folder which contains our custom CSS
app.use(express.static(__dirname + "/public"));
// Seed the database AFTER app configuration
seedDB();

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    // "Express-session" must be initialized BEFORE any other Passport inits
    secret: "Rum is the most varied and complex spirit in the world.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); // a method 'tacked-on' to our User model from "UserSchema.plugin(passportLocalMongoose);"

passport.serializeUser(User.serializeUser()); // another method 'tacked-on' from "passportLocalMongoose"
passport.deserializeUser(User.deserializeUser()); // another method 'tacked-on' from "passportLocalMongoose"

app.use((req, res, next) => {
  res.locals.currentUser = req.user; // makes "currentUser" available & defined for each template
  next();
});

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
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
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
app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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

//=================
// AUTH ROUTES
//=================

// Show register form
app.get("/register", (req, res) => {
  res.render("register");
});

// Handle sign up logic
app.post("/register", (req, res) => {
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
app.get("/login", (req, res) => {
  res.render("login");
});

// Handling Login logic
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

// LOGOUT Route
app.get("/logout", (req, res) => {
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

// Start server
app.listen(1000, function () {
  console.log("The CampWI server has started at localhost:1000!!!");
});
