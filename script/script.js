/**
 * Created by jesse on 7/11/2017.
 */

var locations = [
    {lat: 49.372485, lng: -123.099508, name: "Grouse Mountain"},
    {lat: 49.396207, lng: -123.204513, name: "Cypress Mountain Ski Area"},
    {lat: 49.365928, lng: -122.948324, name: "Mount Seymour"},
    {lat: 49.383529, lng: -123.056634, name: "Mount Fromme"},
    {lat: 49.311927, lng: -123.082117, name: "Lonsdale Quay"}
];

// returns a wikipedia base url
var getBaseWikiUrl = function () {
    return "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="
};

var formatPageName = function (name) {
    return name.replace(' ', '%20')
};



// for(var i in locations){
//     (function (key) {
//         $.ajax({
//             url: getBaseWikiUrl() + formatPageName(locations[key].name),
//             dataType: 'jsonp',
//             success: function(data){
//                 var pageKey = '';
//                 $.each(data.query.pages, function(item) {
//                     pageKey = item;
//                 });
//                 //console.log(data.query.pages[pageKey].extract);
//                 locations[key].info = JSON.stringify(data.query.pages[pageKey].extract);
//                 locations[0].info = JSON.stringify(data.query.pages[pageKey].extract);
//             },
//             error: function(data) {
//                 alert("There was an ajax error")
//             }
//         })
//
//     })(i);
// }

// $.each(locations, function (i, location) {
//    $.ajax({
//             url: getBaseWikiUrl() + formatPageName(location.name),
//             dataType: 'jsonp',
//             success: function(data){
//                 var pageKey = '';
//                 $.each(data.query.pages, function(item) {
//                     pageKey = item;
//                 });
//                 //console.log(data.query.pages[pageKey].extract);
//                 location.info = JSON.stringify(data.query.pages[pageKey].extract);
//                 console.log(location.info)
//             },
//             error: function(data) {
//                 alert("There was an ajax error")
//             }
//         })
// });
//
// console.log(locations[4].info);


// $.ajax({
//     url: url,
//     dataType: 'jsonp',
//     success: function (data) {
//         console.log("request success");
//         var pageKey = '';
//         $.each(data.query.pages, function (item) {
//             pageKey = item;
//         });
//         locations[0].info = data.query.pages[pageKey].extract
//         console.log(locations[0].info)
//     },
//     error: function (data) {
//         alert("ajax failure");
//     }
// });
//
// function sendAjax(key) {
//         $.ajax({
//             url: getBaseWikiUrl() + formatPageName(locations[key].name),
//             dataType: 'jsonp',
//             success: function(data){
//                 var pageKey = '';
//                 $.each(data.query.pages, function(item) {
//                     pageKey = item;
//                 });
//                 //console.log(data.query.pages[pageKey].extract);
//                 console.log(key);
//                 locations[key]['info'] = JSON.stringify(data.query.pages[pageKey].extract);
//                 console.log(locations[key].info)
//             },
//             error: function(data) {
//                 alert("There was an ajax error")
//             }
//         })
// }
//
// for(var i = 0; i < locations.length; i++){
//     console.log(i);
//     sendAjax(i);
// }


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
    };

    // function is called on change of select filter box
    this.filterSelect = function () {
        self.toggleBounce(self.selectedLocation().name());
    };

    // function is called on click of list filter
    // here we'll make an AJAX call to wikipedia if we don't have any
    // info for our location.
    this.clickSelect = function (location) {
        self.toggleBounce(location.name());
        $.ajax({
            url: getBaseWikiUrl() + formatPageName(location.name()),
            dataType: 'jsonp',
            success: function(data) {
                var pageKey = '';
                $.each(data.query.pages, function (item) {
                    pageKey = item;
                });
                location.info(JSON.stringify(data.query.pages[pageKey].extract));
                console.log(location.info())
            },
            error: function () {
                alert("ajax error");
            }

        })
    }
}

// apply ko bindings
ko.applyBindings(new MapsViewModel());
