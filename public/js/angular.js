var app = angular.module('skycastApp', []);

/////////////////////////
// Angular Controller
/////////////////////////
app.controller('mainController', ['$http', function($http) {
  // Declare variables
  let self = this;
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
  // Google Chart variables to load dynamic data into chart
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
  // GET request to Dark Sky API returns forecast
  this.getWeather = () => {
    // Get latitude and longitude from user input
    lat = document.getElementById('latitude').value;
    long = document.getElementById('longitude').value;
    // Save data in controller variables
    this.lat = document.getElementById('latitude').value;
    this.lng = document.getElementById('longitude').value;
    this.location = document.getElementById('city-search').value;
    $http({
      method: 'GET',
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
    });
    this.myLocations.unshift(newLocation);
  }

  // Delete Route for User's Saved Locations
  this.forgetLocation = (location) => {
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
    // Calculate unix times for chart dates
    let yesterday = Math.round((new Date()).getTime() / 1000) - 86400;
    let twoDaysAgo = Math.round((new Date()).getTime() / 1000) - 172800;
    let today = Math.round((new Date()).getTime() / 1000);
    let tomorrow = Math.round((new Date()).getTime() / 1000) + 86400;
    // Time Machine request for each date
    // Save temp and precip data in controller variables
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
    // Create google chart displaying trends
    this.showChart=true;
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
  // User Authentication
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
    });
  }
  // REGISTER
  this.register = (userReg) => {
    if (userReg.password === userReg.confirmPassword) {
      console.log("passwords match");
    } else {
      return this.noMatch = true;
    }
    // Create new user and log em in
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
  // AUTHORIZATION (not called anywhere ... yet)
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
