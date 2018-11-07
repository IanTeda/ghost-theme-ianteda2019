/**
 * MAIN.JS
 * Theme specific Javascript
 */
$(document).ready(() => {
  /**
   * SIDE NAVIGATION
   * Initialise Side Navigation
   */
  $(".sidenav").sidenav({
    // Default is 300
    menuWidth: 250,
    // Choose the horizontal origin
    edge: "left",
    // Closes side-nav on <a> clicks, useful for Angular/Meteor
    closeOnClick: true,
    // Choose whether you can drag to open on touch screens,
    draggable: true,
    // A function to be called when sideNav is opened
    onOpen(el) {},
    // A function to be called when sideNav is closed
    onClose(el) {}
  });
});
