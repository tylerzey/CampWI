# CampWI Site/WebApp

- Add Landing Page
- Add Campgrounds Page that lists all campgrounds

## Each campground has:

- Name
- Image

## Layout & Basic Styling

- Create our header and footer partials
- Add in Bootstrap (and some simple, prelim styles)

## Creating New Campgrounds

- Setup new campground POST route
- Add in body-parser
- Setup route to show form
- Add basic unstyled form

## Style the campgrounds page

- Add a better header/title
- Make campgrounds display in a grid

## Style the Navbar and Form

- Add a navbar to all templates
- Style the new campground form

## Show Page

- Review the RESTful routes we've seen thus far
- Add description to our campground model
- Show db.collection.drop()
- Add a show route/template

## Refactor Mongoose Code

- Create a "models" directory
- Use module.export
- Require everything correctly!

## Add DB Seeds File

- Add a seeds.js file
- Run the seeds file every time the server starts

## Add the Comment Model

- Remedy errors created from adding in Seeds file before all models
- Display comments on campground show page

## Comment New/Create

- Discuss nested routes
- Add the comment new and create routes
- Add the new comment form

## Style Show Page

- Add sidebar to show page
- Display comments nicely

## Auth Pt. 1 - Add User Model

- Install all packages needed for Auth
- Define User model

## Auth Pt. 2 - Register

- Configure Passport
- Add register routes
- Add register template

## Auth Pt. 3 - Login

- Add Login routes
- Add Login template

## Auth Pt. 4 - Logout/Navbar utilities

- Add Logout routes
- Prevent user from adding a comment if not signed in
- Add links to navbar
- Show/hide auth links correctly

## Auth Pt. 5 - Show/Hide Links

- Show/hide auth links in navbar based on loggedIn status
