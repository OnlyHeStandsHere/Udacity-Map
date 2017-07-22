/**
 * Created by jesse on 7/11/2017.
 */

// map is created in it's own file because google maps seems to
    // load more reliably this way. Had trouble with loading order of js files.
var vancouver = {lat: 49.311927, lng: -123.082117};

// callback for google maps api to render the map
// **** since there is a script dependency on /script/script.js ****
// **** the page must wait to load that script and render the markers on the map. ****
// **** This marker creation can only happen AFTER the call to google maps has finished loading ****
  var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: vancouver,
      zoom: 12
    });
    var script   = document.createElement("script");
    script.type  = "text/javascript";
    script.src   = "../script/script.js";    // use this for linked script
    document.body.appendChild(script);
  }

  // if we didn't get a response from google, we'll just have to alert the user
  function mapError() {
      alert("There was a problem loading google maps." +
           "Check your internet connection and firewall settings.");
  }

