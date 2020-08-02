// Require packagaes & primitive files
const methodOverride = require("method-override"),
  LocalStrategy = require("passport-local"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  express = require("express"),
  seedDB = require("./seeds"),
  app = express();

// Set up mongoose SCHEMAS & MODELS
const Campground = require("./models/campground"), // SCHEMA SET-UP: Set up base/default data schema
  Comment = require("./models/comment"), // SCHEMA SET-UP: Set up base/default data schema
  User = require("./models/user");

// Require Routes
const campgroundRoutes = require("./routes/campgrounds"),
  commentRoutes = require("./routes/comments"),
  indexRoutes = require("./routes/index");

// Connect (or create new DB) for mongoose to interact with MongoDB
mongoose
  .connect("mongodb://localhost:27017/camp_wi", {
    // need to use the localhost port of 27017 since our local instance of Mongo runs/listens here
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to 'camp_wi' DB!"))
  .catch((error) => console.log(error.message));
// Avoid deprecated Mongoose methods
mongoose.set("useFindAndModify", false);

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
// set default view files to be ".ejs"
app.set("view engine", "ejs");
// serve the "public" folder which contains our custom CSS
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

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

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes); // pre-prends '/campgrounds' in front of all app.METHOD("/") routes declared in this file
app.use("/campgrounds/:id/comments", commentRoutes);

// Start server
app.listen(1000, function () {
  console.log("The CampWI server has started at localhost:1000!!!");
});
