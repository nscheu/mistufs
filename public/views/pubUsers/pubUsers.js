app.controller('PubUsersCtrl', function ($scope, $http, $location) {
  

  $http.get("/rest/publicUsers")
    .success(function (users) {
      $scope.users = users;
      
    });

  

  $scope.viewUser = function (viewUser) {
    var url = "/pubProfile?id=" + viewUser._id;
    console.log(url);
    $location.url(url);
  };

});