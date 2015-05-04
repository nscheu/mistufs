app.controller('ProfileCtrl', function ($scope, $http, $location,$rootScope) {
  console.log("Profile Controller");
  $scope.currentUser = $rootScope.currentUser;
  console.log($scope.currentUser);

  $scope.openUpdateUserModal = function (user) {
    console.log(user.pubData.firstName);
    console.log(user);
    $scope.updateUser = user;
    //$scope.firstname = user.pubData.firstName;
    //$scope.lastname = user.pubData.lastName;
    $("#openUpdateUserModal").modal('show');
  };

  //Updates the user
  $scope.updateUserInDb = function (updatedUser) {
    console.log("updateUserInDb");
    console.log(updatedUser);
    $("#openUpdateUserModal").modal('hide');
    $http.post("/api/updateUser", updatedUser)
       .success(function (resource) {
         $scope.users = resource;
       });
  };

  //delete user(user)
  $scope.delUser = function (user) {
    var index = $scope.users.indexOf(user);
    console.log("delUser - ProfileJS");
    console.log(user);
    $scope.users.splice(index, 1);
    $http.post("/rest/delUser", user)
   .success(function (deleteduser) {
     console.log("deleterdUser =", user);

     $location.url("/profile");
   });
  };

  $http.get("rest/pubComments")
  .success(function (pubComments) {
    console.log("rest/pubComments");
    console.log(pubComments);
    $scope.pubComments = pubComments;
  });

});
