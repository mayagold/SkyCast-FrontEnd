var app = angular.module('skycastApp', []);

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);


////////////////////
// GOOGLE MAPS
// Resource: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
// This code allows user to search for a specific city using Google Maps and retrieve its lat/lng coordinates. It also auto-updates a google maps view of that location.
////////////////////

var input = '';

function initAutocomplete() {
  // Render map on page: default to Seattle.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.6062, lng: -122.3321},
    zoom: 11,
    mapTypeId: 'satellite'
  });
  // Grab the user's input from the city-search input field. Store it in the input variable.
  input = document.getElementById('city-search');
  // Create the Google Maps search box and enter the input into the searchBox.
  var searchBox = new google.maps.places.SearchBox(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  // create markers variable
  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve more details for that place.
  searchBox.addListener('places_changed', function() {
    // create places variable
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    // Auto-fill the lat/long input fields based on the city searched. (This still has a little bug. If you search a non-specific location e.g. "Indian Restaurant" it will display a bunch of markers on the map and autofill the lat/long coordinates for the first indexed.)

    document.getElementById('latitude').value = places[0].geometry.location.lat();
    document.getElementById('longitude').value = places[0].geometry.location.lng();
    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    // For each place (only should apply to 1 in our case - change this), get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}


/////////////////////////
// Main Controller
/////////////////////////


app.controller('mainController', ['$http', '$scope', '$filter', function($http, $scope, $filter) {

  let self = this;
  let lat;
  let long;

  this.url      = 'http://localhost:3000';
  this.testing  = "Hello Bluewolf";
  this.user     = {};
  this.noMatch  = false;
  this.forecast = '';

  this.getWeather = () => {
    // grab the latitude and longitude values
    let lat = document.getElementById('latitude').value;
    let long = document.getElementById('longitude').value;
    // make the api call
    console.log('https://api.darksky.net/forecast/a9d279d680c92a498e132e03592ee873' + '/' + lat + ',' + long + '?units=auto');
    $http({
      method: 'GET',
      url: 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/a9d279d680c92a498e132e03592ee873' + '/' + lat + ',' + long + '?units=auto',
      headers: { api_key: 'DARK_SKY_API_KEY' },
    }).then( response => {
      console.log(response);
      this.forecast = response.data;
    });
  }

  // User Login Route
  this.login = (userPass) => {
    $http({
      method: 'POST',
      url: this.url + '/users/login',
      data: { user:
        { username: userPass.username,
          password: userPass.password }
      }
    }).then( response => {
      console.log(response);
      this.user = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
      console.log(localStorage.token);
    });
  }

  this.register = (userReg) => {
    if (userReg.password === userReg.confirmPassword) {
      console.log("passwords match");
    } else {
      return this.noMatch = true;
    }

    $http({
      method: 'POST',
      url: this.url + '/users/',
      data: { user:
        { username: userReg.username,
          password: userReg.password }
      }
    }).then( response => {
      console.log(response);
      self.login(userReg);
      this.noMatch = false;
    })
  }

  this.getUsers = () => {
    $http({
      url: this.url + '/users/',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then( response => {
      console.log(response);
      if (response.data.status === 401) {
        this.error = 'Unauthorized';
      } else {
        this.error = "You're logged in to browser session"
      }
    })
  }

  this.logout = () => {
    localStorage.clear('token');
    location.reload();
  }

}])
