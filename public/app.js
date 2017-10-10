var app = angular.module('skycastApp', []);

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

/////////////////////////
// Main Controller
/////////////////////////

app.controller('mainController', ['$http', '$scope', '$filter', function($http, $scope, $filter) {

  let self = this;

  this.url = 'http://localhost:2045';
  this.testing = "Hello Bluewolf";



}])
