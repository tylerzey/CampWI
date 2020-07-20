const express = require("express");
const app = express();
const bodyParser = require("body-parser");

let campgrounds = [
  {
    name: "Salmon Creek",
    image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350",
  },
  {
    name: "Newport State Park",
    image:
      "https://img-aws.ehowcdn.com/700x/cdn.onlyinyourstate.com/wp-content/uploads/2017/10/swirling-stars-above-lake-michigan-700x465.jpg",
  },
  {
    name: "Mountain Goat's Rest",
    image: "https://pixabay.com/get/53e3d5414851aa14f1dc84609620367d1c3ed9e04e507440702d78d59745c6_340.jpg",
  },
];

app.use(bodyParser.urlencoded({ extended: true }));
// set default view files to be ".ejs"
app.set("view engine", "ejs");

// Route path
app.get("/", (req, res) => {
  res.render("landing");
});

// Campgrounds route
app.get("/campgrounds", (req, res) => {
  res.render("campgrounds", { campgrounds: campgrounds });
});

// Allow new campgrounds to be added in
app.post("/campgrounds", (req, res) => {
  // get data from form and add to campgrounds array
  let name = req.body.name;
  let img = req.body.image;
  let newCampground = { name: name, image: img };
  campgrounds.push(newCampground);
  // redirect back to campgrounds page
  res.redirect("/campgrounds"); // default "redirect" is a get request
});

// the route to display the form TO THEN post
app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

// Start server
app.listen(1000, function () {
  console.log("The CampWI server has started at localhost:1000!!!");
});
