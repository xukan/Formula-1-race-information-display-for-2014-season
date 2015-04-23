var register=angular.module('F1FeederApp.registerService', []);

register.controller("registerController", function($scope, $http, $location, $rootScope){

    // $('#myModal').modal({show:true});


    // $('#myModal').on('show.bs.modal', function (e) {
    //     $scope.$apply();
    // });

    $scope.register = function(user){
        console.log(user);
        if(user.password != user.password2 || !user.password || !user.password2)
        {
            $rootScope.message = "Your passwords don't match";
        }
        else
        {
            $http.post("/register", user)
            .success(function(response){
                console.log(response);
                if(response != null)
                {
                    $rootScope.loggedInUser = response.username;
                    // $rootScope.currentUser = response;
                    $location.url("/drivers");
                }
            });
        }
    }
});

