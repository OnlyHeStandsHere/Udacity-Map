/**
 * Created by jesse on 7/11/2017.
 */

var locations = [
    {lat: 49.372485, lng: -123.099508, name: "Grouse Mountain", info: ''},
    {lat: 49.396207, lng: -123.204513, name: "Cypress Mountain", info: ''},
    {lat: 49.365928, lng: -122.948324, name: "Mount Seymour", info: ''},
    {lat: 49.383529, lng: -123.056634, name: "Mount Fromme", info: ''},
    {lat: 49.311927, lng: -123.082117, name: "Lonsdale Quay", info: ''}
];

// returns a wikipedia base url
var getBaseWikiUrl = function () {
    return "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="
};

var formatPageName = function (name) {
    return name.replace(' ', '%20')
};

var url = getBaseWikiUrl() + formatPageName(locations[0].name);

$.ajax({
    url: url,
    dataType: 'jsonp',
    success: function (data) {
        console.log("request success");
        var pageKey = '';
        $.each(data.query.pages, function (item) {
            pageKey = item;
        });
        locations[0].info = data.query.pages[pageKey].extract
        console.log(locations[0].info)
    },
    error: function (data) {
        alert("ajax failure");
    }
});


// Class to represent a single location and marker
function Location(data){
    var self = this;
    self.location = {lat: data.lat, lng: data.lng};
    self.name = ko.observable(data.name);
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

    // make an array of locations
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

    this.clearFilters = function(){
        ko.utils.arrayForEach(self.myLocations(), function (location) {
            location.marker.setAnimation(null);
            location.marker.setVisible(true);
        })

    }

    // function is called on change of select filter box
    this.filterSelect = function () {
        self.toggleBounce(self.selectedLocation().name());

    }

    this.clickSelect = function (location) {
        self.toggleBounce(location.name())
    }



}

// apply ko bindings
ko.applyBindings(new MapsViewModel());
