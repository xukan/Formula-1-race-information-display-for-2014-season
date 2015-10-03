angular.module('F1FeederApp.controllers', ['ui.bootstrap']).

  //DRIVERS CONTROLLER
controller('driversController', function ($scope, $http,$rootScope, $window, ergastAPIservice) {
    $scope.filterName = null;
    $scope.driversList = [];
    
    $scope.items=["2015","2014","2013","2012","2011"];
       
    // $scope.searchFilter = function (driver) {
    //     var keyword = new RegExp($scope.filterName, 'i');
    //     return !$scope.filterName || keyword.test(driver.Driver.givenName) || keyword.test(driver.Driver.familyName);
    // };

    ergastAPIservice.getDrivers().success(function (response) {
        //Dig into the response to get the relevante data
        $scope.driversList = response.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    });

    $scope.follow=function(driver){
        console.log(driver);
        var currentUser = $rootScope.loggedInUser;
        $http.put("/follow/"+currentUser, driver)
        .success(function(response){
            console.log("hi");
            if(response!=null)
                $window.alert("confirmed");
        });
    }
}).



//DRIVER CONTROLLER
controller('driverController', function ($scope, $routeParams, ergastAPIservice) {
    $scope.id = $routeParams.id;
    $scope.races = [];
    $scope.driver = null;
    ergastAPIservice.getDriverDetails($scope.id).success(function (response) {
        $scope.driver = response.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
    });

    ergastAPIservice.getDriverRaces($scope.id).success(function (response) {
        $scope.races = response.MRData.RaceTable.Races;
    });
}).



//TEAMS CONTROLLER
controller('teamsController', function ($scope, $http, ergastAPIservice) {
    $scope.teamsList = [];
    $scope.filterName = null;

    ergastAPIservice.getTeams().success(function (response) {
        //Just diggin into the JSON to get the actual teams list
        //angular.forEach(response.MRData.StandingsTable.StandingsLists[0].ConstructorStandings, function (team, index) {
        //    //Push each team into the teamsList
        //    $scope.teamsList.push(team);
        //});
        $scope.teamsList = response.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    });
}).



//TEAM CONTROLLER
controller('teamController', function ($scope, $routeParams, $http, ergastAPIservice) {
    $scope.id = $routeParams.id;
    $scope.races = [];
    $scope.filterName = null;
    $scope.driverName=null;

    ergastAPIservice.getTeamDetails($scope.id).success(function (response) {
        $scope.team = response.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0];
    });

    ergastAPIservice.getTeamRaces($scope.id).success(function (response) {
        $scope.races = response.MRData.RaceTable.Races;
        //$scope.driverName = race.Results[0].Driver.givenName + race.Results[0].Driver.familyName;
        angular.forEach($scope.races, function (race, index) {
            //Sum the total points of the 
            race.points = parseInt(race.Results[0].points) + parseInt(race.Results[1].points);
        });
    });
}).


//RACES CONTROLLER
controller('racesController', function ($scope, $modal, $log, $http, ergastAPIservice) {
    $scope.pastRaces = [];
    $scope.racesList = [];
    $scope.filterName = null;
    ergastAPIservice.getRaceWinners().success(function (response) {
        //Dig into the response to get the relevante data
        $scope.pastRaces = response.MRData.RaceTable.Races;
        ergastAPIservice.getRaces().success(function (response) {
            $scope.racesList = response.MRData.RaceTable.Races;
            angular.forEach($scope.pastRaces, function (race, index) {
                //Push each winning driver into raceList
                $scope.racesList[index].Results = race.Results;
            });
        });
    });
    
    $scope.showModal = function (size, selectedCircuit) {
        console.log(selectedCircuit);
        console.log(size);
        var modalInstance = $modal.open({
           // backdrop : 'static',
            templateUrl: 'myModalContent.html',
            controller: function ($scope, $modalInstance, circuit){
                //这里参数的circuit名称必须和$scope.circuit定义中的一致
                $scope.circuit = circuit;

                $scope.ok = function () {
                    //$modalInstance.close($scope.selected.item);
                    $modalInstance.close($scope.circuit);
                };

                $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
                };
            },
            //circuitId : selectedCircuitId,
            size:size,
            resolve: {
                    circuit: function () {
                    return selectedCircuit;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}).

//RACE CONTROLLER
controller('raceController', function ($scope, $routeParams, $http, ergastAPIservice) {
    $scope.id = $routeParams.id;
    $scope.raceResult = [];
    $scope.qualiResult = [];

    ergastAPIservice.getRaceDetails($scope.id).success(function (response) {
        $scope.race = response.MRData.RaceTable.Races[0];
        $scope.raceResult = response.MRData.RaceTable.Races[0].Results;
    });
      
    ergastAPIservice.getQualiDetails($scope.id).success(function (response) {
        $scope.qualiResult = response.MRData.RaceTable.Races[0].QualifyingResults;
    });

    //MOVE THIS ONE TO A SERVICE
    $http.jsonp('http://ergast.com/api/f1/2014/' + $routeParams.id + '/results.json?callback=JSON_CALLBACK').success(function (response) {
        $scope.race = response.MRData.RaceTable.Races[0];
        $scope.raceResult = response.MRData.RaceTable.Races[0].Results;
    }).error(function (error) {
    });

    //THIS ONE AS WELL< FOR A SEPRATE SERVICE
    $http.jsonp('http://ergast.com/api/f1/2014/' + $routeParams.id + '/qualifying.json?callback=JSON_CALLBACK').success(function (response) {
        $scope.qualiResult = response.MRData.RaceTable.Races[0].QualifyingResults;
    }).error(function (error) {
    });
}).

controller('menuContr', function ($scope, $location) {
    $scope.$on('$routeChangeSuccess', function () {
        $scope.menuActive = $location.path().split("/")[1];
    });
});
