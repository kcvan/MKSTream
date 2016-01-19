angular.module('home', [])

.controller('homeController', function($scope, $state, $stateParams) {

  $scope.guid = function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  }
  $scope.file = 'sample.txt';

  $scope.generateLink = function() {
    $scope.hash = $scope.guid();
    $stateParams.test = $scope.hash;
    $state.go('link');
  };

  $scope.testParams = $stateParams;

  $scope.home = function() {
    $state.go('home');
  }
  $scope.home();
  console.log($stateParams.test);
});
