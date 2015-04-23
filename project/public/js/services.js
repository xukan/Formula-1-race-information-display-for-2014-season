//We abstract our server API calls from the controller, let’s create our own custom service which will fetch our data and
//act as a wrapper around $http by adding this to our services.js

var ergastAPIservice = angular.module('F1FeederApp.services', []);
ergastAPIservice.factory('ergastAPIservice', function ($http) {
    var ergastAPI= {};
    ergastAPI.getDrivers = function () {
        return $http({
            method: 'JSONP',
            url: 'http://ergast.com/api/f1/2014/driverStandings.json?callback=JSON_CALLBACK'
        });
    }

    ergastAPI.getDriverDetails = function (id) {
        return $http({
            method: 'JSONP',
            url: 'http://ergast.com/api/f1/2014/drivers/' + id + '/driverStandings.json?callback=JSON_CALLBACK'
        });
    }

    ergastAPI.getDriverRaces = function (id) {
        return $http({
            method: 'JSONP',
            url: 'http://ergast.com/api/f1/2014/drivers/' + id + '/results.json?callback=JSON_CALLBACK'
        });
    }

    ergastAPI.getTeams = function () {
        return $http({
            method: 'JSONP',
            url: 'http://ergast.com/api/f1/2014/constructorStandings.json?callback=JSON_CALLBACK'
        });
    }

    ergastAPI.getTeamDetails = function (id) {
        return $http({
            method: 'JSONP',
            url: 'http://ergast.com/api/f1/2014/constructors/' + id + '/constructorStandings.json?callback=JSON_CALLBACK'
        });
    }

    ergastAPI.getTeamRaces = function (id) {
        return $http({
            method: 'JSONP',
            url: 'http://ergast.com/api/f1/2014/constructors/' + id + '/results.json?callback=JSON_CALLBACK'
        });
    }

    ergastAPI.getRaceWinners = function () {
        return $http({
            method: 'JSONP',
            url: 'http://ergast.com/api/f1/2014/results/1.json?callback=JSON_CALLBACK'
        });
    }

    ergastAPI.getRaces = function () {
        return $http({
            method: 'JSONP',
            url: 'http://ergast.com/api/f1/2014.json?callback=JSON_CALLBACK'
        });
    }

    ergastAPI.getRaceDetails = function (id) {
        return $http({
            method: 'JSONP',
            url: 'http://ergast.com/api/f1/2014/' + id + '/results.json?callback=JSON_CALLBACK'
        });
    }
    //http://ergast.com/api/f1/2014/1/results.json?callback=JSON_CALLBACK

    ergastAPI.getQualiDetails = function (id) {
        return $http({
            method: 'JSONP',
            url: 'http://ergast.com/api/f1/2014/' + id + '/qualifying.json?callback=JSON_CALLBACK'
        });
    }
    //http://ergast.com/api/f1/2014/1/qualifying.json?callback=JSON_CALLBACK
    console.log(ergastAPI);
    return ergastAPI;
});