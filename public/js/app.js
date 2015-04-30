var app = angular.module('mistufsApp', ['ngRoute']);

app.config(function($routeProvider, $httpProvider) {
  $routeProvider
   .when('/', {
     templateUrl: '/views/home.html',
     controller: 'HomeCtrl'
   })
    .when('/login', {
    templateUrl: '/views/login/login.html',
    controller: 'LoginCtrl'
    })
    .when('/profile', {
    templateUrl: '/views/profile/profile.html',
    controller: 'ProfileCtrl',
      resolve: {
        loggedin: checkLoggedIn
      }
    })
    .when('/pubProfile', {
      templateUrl: '/views/pubProfile/pubProfile.html',
      controller: 'pubProfileCtrl',
      resolve: {
        loggedin: checkLoggedIn
      }
    })
    .when('/register', {
      templateUrl: '/views/register/register.html',
      controller: 'RegisterCtrl'
    })
    .when('/users', {
      templateUrl: '/views/users/users.html',
      controller: 'UsersCtrl'
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
  console.log("NavCtrl Controller");
  $scope.logout = function () {
    $http.post("/logout")
    .success(function () {
      $rootScope.currentUser = null;
      $location.url("/login");
    });
  }
});

app.controller('HomeCtrl', function($scope) {
  $scope.openRegisterModal = function () {
    
    
    //$scope.updateUser = user;
    //$scope.firstname = user.pubData.firstName;
    //$scope.lastname = user.pubData.lastName;
    $("#register_modal").modal('show');
  };
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
      callback();
    })
  }
  return {
    login: login,
    logout: logout
  }
});