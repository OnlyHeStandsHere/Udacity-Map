/**
 * Created by jesse on 7/11/2017.
 */

// map is created in it's own file because google maps seems to
    // load more reliably this way. Had trouble with loading order of js files.
var vancouver = {lat: 49.311927, lng: -123.082117};

// callback for google maps api to render the map
  var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: vancouver,
      zoom: 12
    })
  }


