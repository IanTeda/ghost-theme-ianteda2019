/**
 * MAIN.JS
 * Theme specific Javascript
 */

/**
 * INITIATE MATERIALIZE SIDENAV
 * https://materializecss.com/sidenav.html
 */
document.addEventListener("DOMContentLoaded", function() {
  let elems = document.querySelectorAll(".sidenav");
  let options = {
    // Default is 300
    menuWidth: 250,
    // Choose the horizontal origin
    edge: "left",
    // Closes side-nav on <a> clicks, useful for Angular/Meteor
    closeOnClick: true,
    // Choose whether you can drag to open on touch screens,
    draggable: true
  };
  var instances = M.Sidenav.init(elems, options);
});

/**
 * INITIATE MATERIALIZE MODAL
 * https://materializecss.com/modals.html
 */
document.addEventListener("DOMContentLoaded", function() {
  let elements = document.querySelectorAll(".modal");
  let options = {
    onCloseEnd: function() {
      // TODO: Clear text feild when search result clicked
      // console.log("Close Modal");
    },
    opacity: 0.8
  };
  var instances = M.Modal.init(elements, options);
});

/**
 * INITIATE MATERIALIZE FORMS TEXT FIELDS
 * https://materializecss.com/text-inputs.html
 */
M.updateTextFields();

document.addEventListener("DOMContentLoaded", function() {
  let elems = document.querySelectorAll(".carousel");
  let options = {
    fullWidth: true,
    indicators: true,
    duration: 100
  };
  var instances = M.Carousel.init(elems, options);
});

$(document).ready(function() {
  /**
   * INITIATE GHOST SEARCH
   * https://github.com/HauntedThemes/ghost-search
   */
  let ghostSearch = new GhostSearch({
    template: function(result) {
      // Add /blog/ route to search results
      let url = [location.protocol, "//", location.host].join("") + "/blog/";
      return (
        '<a href="' + url + "/" + result.slug + '">' + result.title + "</a>"
      );
    }
  });

  autoplay();
  function autoplay() {
    $(".carousel").carousel("next");
    setTimeout(autoplay, 4500);
  }
});

/**
 * SHOW NAVBAR
 * Show the navbar after scrolling past header image
 */

// Function to change the div class to hide and show
let myScrollFunc = function() {
  // What div are we showing and hiding
  let navbarID = document.getElementById("navbar");

  // Get div client height
  let clientHeight = document.getElementById("header").clientHeight;

  // Window scroll dimension
  let y = window.scrollY;

  // If we go past the header image show the navbar div
  if (y >= clientHeight - 71 * 2) {
    // Show navbar div
    navbarID.className = "navbar-fixed";
  } else {
    // Hide navbar div on mobile up
    navbarID.className = "navbar-fixed hide-on-med-and-up";
  }
};

// Monitor document window scroll
//window.addEventListener("scroll", myScrollFunc);
// Monitor document window resize
// window.onresize = myScrollFunc;
