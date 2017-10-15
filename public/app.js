var app = angular.module('skycastApp', []);
var input = '';

google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(app.drawChart);


////////////////////
// GOOGLE MAPS
// Resource: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
// This code allows user to search for a specific city using Google Maps and retrieve its lat/lng coordinates. It also auto-updates a google maps view of that location.
////////////////////
function initAutocomplete() {
  // Render map on page: default to Seattle.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.6062, lng: -122.3321},
    zoom: 11,
    mapTypeId: 'roadmap',
    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          // Exported from https://mapstyle.withgoogle.com/
          {
            "color": "#212121"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "stylers": [
          {
            "color": "#963f42"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.business",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#181818"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#1b1b1b"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#2c2c2c"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8a8a8a"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#373737"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#3c3c3c"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#4e4e4e"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#3d3d3d"
          }
        ]
      }
    ]
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
    // For each place (only should apply to 1 in our case), get the icon, name and location.
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
  // Declare variables
  let self = this;
  // this.url      = 'http://localhost:3000';
  this.url      = 'https://skycast-api-maya.herokuapp.com';
  this.user     = {};
  this.noMatch  = false;
  this.forecast = '';
  this.home = true;
  this.lat = 0;
  this.lng = 0;
  this.location = '';
  this.myLocations = [];
  this.myForecast = {};
  this.newLocation = {};
  this.todayTemp = 0;
  this.twoDaysAgoTemp = 0;
  this.yesterdayTemp = 0;
  this.tomorrowTemp = 0;
  this.todayPrecip = 0;
  this.twoDaysAgoPrecip = 0;
  this.yesterdayPrecip = 0;
  this.tomorrowPrecip = 0;
  this.showChart = false;


  // GET WEATHER
  // Store the input values of searched location in variables so that they can be referenced outside this function
  // GET request to Dark Sky API returns forecast
  this.getWeather = () => {
    lat = document.getElementById('latitude').value;
    long = document.getElementById('longitude').value;
    // make the api call
    this.lat = document.getElementById('latitude').value;
    this.lng = document.getElementById('longitude').value;
    this.location = document.getElementById('city-search').value;
    // console.log('https://api.darksky.net/forecast/a9d279d680c92a498e132e03592ee873' + '/' + lat + ',' + long + '?units=auto');
    $http({
      method: 'GET',
      // url: this.url + '/forecasts/index',
      url: 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/a9d279d680c92a498e132e03592ee873' + '/' + lat + ',' + long + '?units=auto',
      headers: { api_key: 'DARK_SKY_API_KEY' },
    }).then( response => {
      console.log(response);
      this.forecast = response.data;
      // Get the current skycon value
      let currentIcon = response.data.currently.icon;
      self.setSkycon(currentIcon);
    });
  }

  // Play whichever skycon is referenced in the forecast.
  this.setSkycon = (currentIcon) => {
    let skycon = new Skycons({"color": "whitesmoke"});
    if (currentIcon==="partly-cloudy-night"){
      skycon.set("skycon", Skycons.PARTLY_CLOUDY_NIGHT);
    } else if (currentIcon==="clear-day"){
      skycon.set("skycon", Skycons.CLEAR_DAY);
    } else if (currentIcon==="clear-night"){
      skycon.set("skycon", Skycons.CLEAR_NIGHT);
    } else if (currentIcon==="partly-cloudy-day"){
      skycon.set("skycon", Skycons.PARTLY_CLOUDY_DAY);
    } else if (currentIcon==="cloudy"){
      skycon.set("skycon", Skycons.CLOUDY);
    } else if (currentIcon==="rain"){
      skycon.set("skycon", Skycons.RAIN);
    } else if (currentIcon==="sleet"){
      skycon.set("skycon", Skycons.SLEET);
    } else if (currentIcon==="snow"){
      skycon.set("skycon", Skycons.SNOW);
    } else if (currentIcon==="wind"){
      skycon.set("skycon", Skycons.WIND);
    } else if (currentIcon==="fog"){
      skycon.set("skycon", Skycons.FOG);
    }
    skycon.play();
    this.getTrends();
  }

  // SAVE LOCATION
  // Sends POST request to server
  // Saves the most recently forecasted location with latitude, longitude, location name, and user's ID
  this.saveLocation = (lat, long, location) => {
    // console.log('called saveLocation()');
    $http({
      method: 'POST',
      url: this.url + '/locations/',
      data: {
        location: {
          lat: this.lat,
          lng: this.lng,
          location_name: this.location,
          user_id: this.user.id
        }
      }
    }).then( response => {
      // console.log('processed');
      // console.log(this.lat, "lat");
      // console.log(this.lng, "lng");
      // console.log(this.location, "location");
      console.log(response);
      this.myLocations.push(response.data);
    } )
  }

  // Get the user's saved locations upon login
  this.getLocations = () => {
    this.myLocations = [];
    $http({
      method: 'GET',
      url: this.url + '/locations/',
    }).then( response => {
      console.log(response);
      for (var i=0; i<response.data.length; i++) {
        if (response.data[i].user_id === this.user.id) {
          newLocation = response.data[i];
          lat = response.data[i].lat;
          lng = response.data[i].lng;
          this.getForecast(lat,lng, newLocation);
        }
      }
    })
  }

  this.getForecast = (lat,lng, newLocation) => {
    $http({
      method: 'GET',
      url: 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/a9d279d680c92a498e132e03592ee873' + '/' + lat + ',' + lng + '?units=auto',
      headers: { api_key: 'DARK_SKY_API_KEY' },
    }).then( response => {
      console.log(response);
      let newForecast = response.data;
      newLocation.forecast = newForecast;
      console.log("should this location to array: ", newLocation);
    });
    this.myLocations.unshift(newLocation);
  }

  // Delete Route for User's Saved Locations
  this.forgetLocation = (location) => {
    console.log(location, "Location");
    let id = location.id;
    let index = this.myLocations.indexOf(location);
    $http({
      method: 'DELETE',
      url: this.url + '/locations/' + id
    }).then(response => {
      console.log(response);
      this.myLocations.splice(index, 1);
    }).catch(err => console.log(err));
  }

  this.getTrends = () => {
    let lat = this.lat;
    let lng = this.lng;
    // 24 hours ago
    let yesterday = Math.round((new Date()).getTime() / 1000) - 86400;
    let twoDaysAgo = Math.round((new Date()).getTime() / 1000) - 172800;
    let today = Math.round((new Date()).getTime() / 1000);
    let tomorrow = Math.round((new Date()).getTime() / 1000) + 86400;
    $http({
      method: 'GET',
      url: 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/a9d279d680c92a498e132e03592ee873' + '/' + lat + ',' + long + ',' + yesterday,
      headers: { api_key: 'DARK_SKY_API_KEY' },
    }).then( response => {
      console.log(response);
      this.yesterdayTemp = response.data.currently.apparentTemperature;
      this.yesterdayPrecip = response.data.currently.precipProbability * 100;
    });
    $http({
      method: 'GET',
      url: 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/a9d279d680c92a498e132e03592ee873' + '/' + lat + ',' + long + ',' + today,
      headers: { api_key: 'DARK_SKY_API_KEY' },
    }).then( response => {
      console.log(response);
      this.todayTemp = response.data.currently.apparentTemperature;
      this.todayPrecip = response.data.currently.precipProbability * 100;
    });
    $http({
      method: 'GET',
      url: 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/a9d279d680c92a498e132e03592ee873' + '/' + lat + ',' + long + ',' + twoDaysAgo,
      headers: { api_key: 'DARK_SKY_API_KEY' },
    }).then( response => {
      console.log(response);
      this.twoDaysAgoTemp = response.data.currently.apparentTemperature;
      this.twoDaysAgoPrecip = response.data.currently.precipProbability * 100;
    });
    $http({
      method: 'GET',
      url: 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/a9d279d680c92a498e132e03592ee873' + '/' + lat + ',' + long + ',' + tomorrow,
      headers: { api_key: 'DARK_SKY_API_KEY' },
    }).then( response => {
      console.log(response);
      this.tomorrowTemp = response.data.currently.apparentTemperature;
      this.tomorrowPrecip = response.data.currently.precipProbability * 100;
    });
  }

  this.drawChart = () => {
    this.showChart=true;
    console.log(this.twoDaysAgoTemp, "should have a value");
    let title = this.location;
    var data = google.visualization.arrayToDataTable([
      ["Date", "°C", "% Precipitation"],
      ["-2", this.twoDaysAgoTemp, this.twoDaysAgoPrecip],
      ["-1", this.yesterdayTemp, this.yesterdayPrecip],
      ["Today", this.todayTemp, this.todayPrecip],
      ["+1", this.tomorrowTemp, this.tomorrowPrecip]
    ]);
    var view = new google.visualization.DataView(data);
    var options =  { 'title': title,
      width: 400,
      height: 400,
      bar: {groupWidth: "95%"},
      bars: 'vertical',
      curveType: 'function',
      legend: {'position': 'bottom', 'alignment': 'start'},
      colors: ["#8a8a8a", "#963f42"],
      'chartArea': {
          'backgroundColor': {
          'fill': '#F4F4F4',
          'opacity': 100
        },
      }

    };
    var chart = new google.visualization.LineChart(document.getElementById("weather-chart"));
    chart.draw(view, options);
  }

  ///////////////////////////
  // User Authorization
  ///////////////////////////

  // LOGIN
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
      this.home = false;
      // this.getLocations();
    });
  }

  // REGISTER
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

  // AUTHORIZATION
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

  // LOGOUT
  this.logout = () => {
    localStorage.clear('token');
    location.reload();
  }

}])
