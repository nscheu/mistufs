app.controller('FriendsCtrl', function ($location, $scope, $http, $rootScope) {
  $scope.currentUser = $rootScope.currentUser;
  console.log($scope.currentUser);

  $http.get("/rest/user")
    .success(function (users) {
      $scope.users = users;
    });

  $scope.sendRequest = function(newFriend) {
    var request = {
      sourceUserId: $scope.currentUser._id,
      sourceFirstName: $scope.currentUser.firstName,
      sourceLastName: $scope.currentUser.lastName,
      recipient: newFriend._id,
      dateSent: Date.now()
    };
    console.log(request);
   
 


    $http.post('/api/sendFriendRequest', request)
      .success(function (user) {
        if (user) alert("Request Sent");
        //console.log(user);
        $location.url("/friends");
      });
};


  $scope.viewUser = function (viewUser) {
    var url = "/pubProfile?id=" + viewUser._id;
    console.log(url);
    $location.url(url);
  };

 



});