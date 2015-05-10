app.controller('PubProfileCtrl', function ($location, $scope, $http) {
  //$scope.currentUser = $rootScope.currentUser;
  //$scope.friends = $scope.currentUser.friends;
  //$scope.phones = $scope.currentUser.phones;
  //$scope.items = $scope.currentUser.items;
  //$scope.locations = $scope.currentUser.locations;
  //console.log($scope.currentUser);
  console.log("PubProfile Controller");
  
  

  $http.get("/rest/publicUsers")
    .success(function (users) {
      var id = $location.search().id;
      console.log(id);

      $scope.users = users;
      //console.log(users);
      $scope.viewUser = search_array(users, id);
      $scope.comments = $scope.viewUser.pubComments;
      //console.log($scope.viewUser);
    });

  $scope.addComment = function (comment) {
    console.log(comment);
    console.log($scope.currentUser._id);
    var message = {
      srcUserId: $scope.currentUser._id,
      sourceFirstName: $scope.currentUser.firstName,
      sourceLastName: $scope.currentUser.lastName,
      recipient: $scope.viewUser._id,
      body: comment.body,
    };
    console.log(message);
    console.log($scope.viewUser);
    $scope.viewUser.pubComments.push(message);
    $http.post("/api/updateUser", $scope.viewUser)
       .success(function (resource) {
         console.log(resource);
         //$scope.users = resource;
       });
  };

  
  
  

  function search_array(array, value) {
    for (i = 0; i < array.length; i++) {
      if (array[i]._id == value) {
        return array[i];
      }
    }
    return -1;
  };


});