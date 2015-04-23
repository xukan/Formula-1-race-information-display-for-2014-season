'use strict';

var app = angular.module('F1FeederApp', [
  'F1FeederApp.services',
  'F1FeederApp.controllers',
  'F1FeederApp.inmail',
  'F1FeederApp.loginService',
  'F1FeederApp.registerService',
  'F1FeederApp.profileService',
  'F1FeederApp.homeModule',
  'ngRoute'
]);

app.config(['$routeProvider', function ($routeProvider,$httpProvider) {
    $routeProvider.
      when("/home", { templateUrl: "views/homepage.html", controller: "homeController"}).
      when("/profile",{ templateUrl:"views/profile.html", 
        controller: "profileController",
        resolve: {
              loggedin: checkLoggedin
          }
      }).
      when("/drivers", { 
        templateUrl: "views/drivers.html",
        // resolve:{
        //   loggedin : checkLoggedin
        // },
        controller: "driversController" 
      }).
      when("/login", { templateUrl: "views/login.html", controller: "loginServiceController" }).
      when("/register", { templateUrl: "views/register.html", controller: "registerController" }).
      when("/inmail", { 
        templateUrl: "views/inmail.html", 
        controller: "inmailController",
        resolve:{
          loggedin : checkLoggedin
        }
      }).
      when("/drivers/:id", { templateUrl: "views/driver.html", controller: "driverController" }).
      when("/teams", { 
        templateUrl: "views/teams.html", 
        controller: "teamsController",
        resolve:{
          loggedin : checkLoggedin
        }
      }).
      when("/teams/:id", { templateUrl: "views/team.html", controller: "teamController" }).
      when("/races", { 
        templateUrl: "views/races.html", 
        controller: "racesController",
        resolve:{
          loggedin : checkLoggedin
        }
      }).
      when("/races/:id", { templateUrl: "views/race.html", controller: "raceController" }).
      otherwise({ redirectTo: "/home" });
}]);

app.controller("NavController", function($scope, $rootScope, $http,$location){
    $scope.logout = function () {
      console.log($rootScope.loggedInUser);
        // currentUser = null;
        
          $http.post("/logout").success(function(){
              $rootScope.loggedInUser=null;
              $location.url("/login");
          });    
    };
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
{
    var deferred = $q.defer();

    $http.get('/loggedin').success(function(user)
    {
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user !== '0')
        {
            $rootScope.currentUser = user;
            deferred.resolve();
        }
        // User is Not Authenticated
        else
        {
            $rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/login');
        }
    });
    
    return deferred.promise;
};
