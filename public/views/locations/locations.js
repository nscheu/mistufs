app.controller('LocationsCtrl', function ($location, $scope, $http, $rootScope) {
  $scope.currentUser = $rootScope.currentUser;
  $scope.friends = $scope.currentUser.friends;
  $scope.phones = $scope.currentUser.phones;
  $scope.items = $scope.currentUser.items;
  $scope.locations = $scope.currentUser.locations;
  console.log($scope.currentUser);


  $scope.addLocation = function (location) {
    console.log("addLocation");
    //console.log(location);
    $scope.currentUser.locations.push(location);
    //$rootScope.currentUser.locations.push(location);
    //console.log($scope.currentUser);

    $http.post('/api/updateUserLocations', $scope.currentUser)
        .success(function (user) {
          
          $scope.locations = $scope.currentUser.locations;
          //console.log($scope.currentUser);
          //console.log($scope.currentUser);
          $location.url("/locations");
        });
  };

});