/**
 * Created by jesse on 7/11/2017.
 */

// the locations we will place on the map
var locations = [
    {lat: 49.372485, lng: -123.099508, name: "Grouse Mountain"},
    {lat: 49.396207, lng: -123.204513, name: "Cypress Mountain Ski Area"},
    {lat: 49.365928, lng: -122.948324, name: "Mount Seymour"},
    {lat: 49.383529, lng: -123.056634, name: "Mount Fromme"},
    {lat: 49.311927, lng: -123.082117, name: "Lonsdale Quay"}
];

// returns a wikipedia base url for ajax calls
var getBaseWikiUrl = function () {
    return "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="
};

// replaces spaces with %20 to format as query parameter
var formatPageName = function (name) {
    return name.replace(' ', '%20')
};


// Class to represent a single location and marker
function Location(data){
    var self = this;
    self.location = {lat: data.lat, lng: data.lng};
    self.name = ko.observable(data.name);
    self.info = ko.observable();
    self.marker = new google.maps.Marker({
        position: self.location,
        map: map,
        title: data.name
    });
}


// maps view model
function MapsViewModel() {
    var self = this;

    this.myLocations = ko.observableArray([]);
    this.selectedLocation = ko.observable();

    // info window is shared by all markers
    // makes sure only one info window is open at a time on the map
    this.myInfo = new google.maps.InfoWindow();


    // make an observable array of locations
    locations.forEach(function (location){
        self.myLocations.push(new Location(location));
    });

    // function to toggle bounce animation for selected marker and filter
    this.toggleBounce = function (filter) {
        ko.utils.arrayForEach(self.myLocations(), function (location) {
            if(location.name() === filter){
                location.marker.setAnimation(google.maps.Animation.BOUNCE);
                location.marker.setVisible(true);
            }
            else {
                location.marker.setAnimation(null);
                location.marker.setVisible(false);
            }
        })
    };

    // function is called on click of list filter
    // here we'll make an AJAX call to wikipedia if we don't have any
    // info for our location.
    this.clickSelect = function (location) {
        self.toggleBounce(location.name());

        if (!location.info()){      // only make the ajax call to wikipedia if we don't already have the info
         $.ajax({
            url: getBaseWikiUrl() + formatPageName(location.name()),
            dataType: 'jsonp',
            success: function(data) {
                var pageKey = '';
                $.each(data.query.pages, function (item) {
                    pageKey = item;
                });
                location.info(JSON.stringify(data.query.pages[pageKey].extract));
                self.myInfo.setContent(location.info());
                self.myInfo.open(map, location.marker);
            },
            error: function () {
                alert("There was an error retrieving information for " + location.name() + "Please refresh page and try again.");
            }
        })
        }
        else{
            self.myInfo.setContent(location.info());
            self.myInfo.open(map, location.marker);
        }

    };

    // now set up the click event listeners on the map markers
    // these click listeners will reference the same click event
    // as the list items
    ko.utils.arrayForEach(self.myLocations(), function (location) {
        location.marker.addListener('click', function () {
            self.clickSelect(location);
        })
    });

    // create the ability to clear all applied filters
    // animations and info windows.
    this.clearFilters = function(){
        ko.utils.arrayForEach(self.myLocations(), function (location) {
            location.marker.setAnimation(null);
            location.marker.setVisible(true);
        });
        self.myInfo.close();
    };

    // function is called on change of select filter box
    this.filterSelect = function (location) {
        self.clickSelect(self.selectedLocation())
    };

}

// apply ko bindings
ko.applyBindings(new MapsViewModel());
