app.controller('StuffCtrl', function ($location, $scope, $http, $rootScope) {
  $scope.currentUser = $rootScope.currentUser;
  $scope.friends = $scope.currentUser.friends;
  $scope.phones = $scope.currentUser.phones;
  $scope.items = $scope.currentUser.items;
  console.log($scope.currentUser);

  $scope.addItem = function (item) {
    console.log(item);
    $scope.currentUser.items.push(item);
    console.log($scope.currentUser);

    $http.post('/api/updateUserItems', $scope.currentUser)
        .success(function (user) {
          $rootScope.currentUser = user;
          $scope.currentUser = user;
          //console.log(user);
          $location.url("/stuff");
        });
  };

});