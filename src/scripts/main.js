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
    }
  };
  var instances = M.Modal.init(elements, options);
});

/**
 * INITIATE MATERIALIZE FORMS TEXT FIELDS
 * https://materializecss.com/text-inputs.html
 */
M.updateTextFields();

$(document).ready(function() {
  /**
   * INITIATE GHOST SEARCH
   * https://github.com/HauntedThemes/ghost-search
   */
  let ghostSearch = new GhostSearch({
    template: function(result) {
      // Add /blog/ route to search results
      let url = [location.protocol, "//", location.host].join("") + "/blogs/";
      return (
        '<a href="' + url + "/" + result.slug + '">' + result.title + "</a>"
      );
    }
  });
});
