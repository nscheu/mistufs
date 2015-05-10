var app = angular.module('mistufsApp', ['ngRoute']);

app.config(function($routeProvider, $httpProvider) {
  $routeProvider
   .when('/', {
     templateUrl: '/views/home.html',
     controller: 'HomeCtrl'
   })
    .when('/mission', {
      templateUrl: '/views/mission/mission.html',
      controller: 'MissionCtrl'
    })
    .when('/contact', {
      templateUrl: '/views/contact/contact.html',
      controller: 'ContactCtrl'
    })    
    .when('/register', {
      templateUrl: '/views/register/register.html',
      controller: 'RegisterCtrl',
    })
    .when('/pubUsers', {
      templateUrl: '/views/pubUsers/pubUsers.html',
      controller: 'PubUsersCtrl',
    })
    .when('/pubProfile', {
       templateUrl: '/views/pubProfile/pubProfile.html',
       controller: 'PubProfileCtrl',
     })
    .when('/feed', {
      templateUrl: '/views/feed/feed.html',
      controller: 'FeedCtrl',
    })
    .when('/locations', {
      templateUrl: '/views/locations/locations.html',
      controller: 'LocationsCtrl',
    })
    .when('/stuff', {
      templateUrl: '/views/stuff/stuff.html',
      controller: 'StuffCtrl',
    })
    .when('/friends', {
      templateUrl: '/views/friends/friends.html',
      controller: 'FriendsCtrl',
    })
     
    .when('/profile', {
      templateUrl: '/views/profile/profile.html',
      controller: 'ProfileCtrl',
      resolve: {
        loggedin: checkLoggedIn
      }
    })
    
    .otherwise({
      redirectTo: '/'
    });

  $httpProvider
  .interceptors
  .push(function($q, $location){
    return {
      response: function(response) {
        return response;
      },
      responseError: function(response){
        if(response.status === 401)
          $location.url('/login');
        return $q.reject(response);
      }
    };
  });
});



var checkLoggedIn = function ($q, $timeout, $http, $location, $rootScope) {
  var deferred = $q.defer();

  $http.get('/loggedin').success(function (user) {
    //console.log('checkLoggedIn');
    //console.log(user);

    $rootScope.errorMessage = null;
    //User is Authenticated
    if (user !== '0') {
      $rootScope.currentUser = user;
      deferred.resolve();
    }
      //User is Not Authenticated
    else {
      $rootScope.errorMessage = 'You need to log in.';
      deferred.reject();
      $location.url('/login');
    }
  });
  return deferred.promise;
}

app.controller('NavCtrl', function ($rootScope, $scope, $http, $location) {
  
  $scope.login = function (user) {
    //console.log(user);
    $http.post('/login', user)
    .success(function (response) {
      console.log(response);
      $rootScope.currentUser = response;
      //$scope.currentUser = response;
      $location.url("/profile");
    });
  };


  console.log("NavCtrl Controller");
  $scope.logout = function () {
    $http.post("/logout")
    .success(function () {
      $rootScope.currentUser = null;
      $location.url("/");
    });
  };
});

app.controller('HomeCtrl', function($scope) {
  
});




app.factory('SecurityService', function ($http, $location, $rootScope) {

  var login = function (user, callback) {
    //console.log(user);
    $http.post('/login', user)
    .success(function(user){
      $rootScope.currentUser = user;
      callback(user);
    });
  }

  var logout = function(callback) {
    $http.post('/logout')
    .success(function(){
      $rootScope.currentUser = null;
      $scope.currentUser = null;
      callback();
    })
  }
  return {
    login: login,
    logout: logout
  }
});