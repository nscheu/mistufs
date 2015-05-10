app.controller('FeedCtrl', function ($location, $scope, $http, $rootScope) {
  console.log("Comment Feed Controller");
  console.log($rootScope.currentUser);
  
  $scope.comments = $rootScope.currentUser.pubComments;
  console.log($scope.comments);
});