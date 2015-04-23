var profile=angular.module('F1FeederApp.profileService', []);
profile.controller('profileController', function($scope, $rootScope, $http, $window){
    $scope.selectedUserIndex = null;
    $scope.favorites=[];
    var currentUser = $rootScope.loggedInUser;

    $http.get("/rest/user")
    .success(function(users)
    {
        $scope.users = users;
    });

    //to show favorite drivers and teams in profile
    $http.get("/follow/"+currentUser)
    .success(function(response){
        //$scope.userInfo = response;
        console.log(response);

        //console.log(response.favorite);
        $scope.favorites=response[0].favorite;
    });

    //to delete a set of favorite driver and team
    $scope.unfollow = function(currentUser, driver){
        console.log(driver);

        $http.put("/follow/"+currentUser+"/favorite/" + driver)
        .success(function (response) {
            $scope.favorites = response[0].favorite;
            console.log("hi");
            console.log($scope.favorites);
            console.log("hi");
            //$scope.selectedSite = res[$scope.selectedIndex];
        });
        // console.log(username);
       
        // $http.delete('/follow/'+favorite[0].driver+'/'+username)
        // .success(function(favorites){
        //     $scope.favorites = favorites;
        //     console.log(favorites);
        // });
    }
    
    $scope.remove = function(user)
    {
        $http.delete('/rest/user/'+user._id)
        .success(function(users){
           $scope.users = users; 
        });
    }
    
    $scope.update = function(user)
    {
        console.log(user);
        $http.put('/rest/user/'+user._id, user)
        .success(function(users){
            $scope.users = users; 
            $window.alert("Update is successful");
        });
    }
    
    $scope.add = function(user)
    {
        $http.post('/rest/user', user)
        .success(function(users){
            $scope.users = users; 
        });
    }
    
    $scope.select = function(user, index)
    {
        $scope.user = user;
        $scope.selectedUserIndex = index;
    }
});