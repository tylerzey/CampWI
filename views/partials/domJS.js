// Code to animate navbar on scroll
const mainNavbar = document.getElementById("mainNavbar");

mainNavbar.addEventListener("scroll", () => {
  mainNavbar.toggleClass("scrolled", this.scrollTop() > this.height());
});
