/**
 * Created by jesse on 7/11/2017.
 */

var vancouver = {lat: 49.246292, lng: -123.116226};




// callback for google maps api to render the map
  var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: vancouver,
      zoom: 11
    })
  }


