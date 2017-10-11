var app = angular.module('skycastApp', []);

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

/////////////////////////
// Main Controller
/////////////////////////

app.controller('mainController', ['$http', '$scope', '$filter', function($http, $scope, $filter) {

  let self = this;

  this.url      = 'http://localhost:3000';
  this.testing  = "Hello Bluewolf";
  this.user     = {};
  this.noMatch  = false;

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
      this.user = response.data.user
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

}])
