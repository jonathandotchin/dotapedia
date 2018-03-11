// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.


// contains the basic app setup such as calling the proper initializations functions
(function () {
    "use strict";

    // define the application variable to store global app logic
    window.dotapedia = {};

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    document.addEventListener('init', onInit.bind(this), false);

    function onDeviceReady() {
    };

    function onInit() {
        // more like an candidate 'page' because it could be the element is not a onsen page
        var page = event.target;

        // each onsen page calls its own initialization controller
        // there has to be a matching between the id and the name of the function in controllers
        if (window.dotapedia.controllers.hasOwnProperty(page.id)) {
            window.dotapedia.controllers[page.id](page);
        }
    }
})();

