var login = angular.module('F1FeederApp.loginService', []);

login.controller('loginServiceController', function LoginService($scope, $http, $window,$location, $rootScope) {
    var currentUser = null;
    var loginfail = null;
    var getCurrentUser = function () {
        return currentUser;
    };
    var getloginfail = function () {
        return loginfail;
    };

    $scope.login = function (user, callback) {
        console.log("here");
        loginfail = null;
        $http.post("/login", user)
        .success(function (response) {
            console.log("service current user blah: " + response);
            currentUser = response;
            $rootScope.loggedInUser = currentUser.username;
            console.log("username is this : "+currentUser.username);
            $location.url("/drivers");
        })
        .error(function (response) {
            console.log("service current user failed" + response);
            $window.alert("username or password is wrong, please retry");
            currentUser = null;
            loginfail = true;
            callback();
            //return;
        });
    };

    //  $scope.showModal = function() {
    //     ModalService.showModal({
    //         templateUrl: 'modal.html',
    //         controller: "ModalController"
    //     }).then(function(modal) {
    //         modal.element.modal();
    //         modal.close.then(function(result) {
    //             $scope.message = "You said " + result;
    //         });
    //     });
    // };

    var addInfo = function (user, callback) {
        console.log(user);
        $http.post("/register", user)
        .success(function (res) {
            if (res == user) {
                console.log("inside Service add" + res.username);
                console.log(res);
                login(res);
            } else {
                callback(res);
            }
        });
    };

    // var logout = function () {
    //     currentUser = null;
    //     $http.post("/logout", currentUser)
    //     .success(function (res) {
    //         $rootScope.loggedInUser = null;
    //         $location.url("/login");
    //     });
    // };
   
    return {
        login: login,
        add: addInfo,
        getCurrentUser: getCurrentUser,
        //logout: logout,
        getloginfail: getloginfail
    }

});


// login.controller('ModalController', function($scope, close) {
//     $scope.close = function() {
//         close(500); // close, but give 500ms for bootstrap to animate
//     };
// });