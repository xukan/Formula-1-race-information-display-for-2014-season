var inmail = angular.module('F1FeederApp.inmail', ['luegg.directives']);

inmail.factory('socket', function () {
    //||'http://localhost:8000'
    var socket = io.connect('http://formula1-kanexu.rhcloud.com:8000');
    return socket;
});

inmail.controller('inmailController', function ($scope,$rootScope, $http, socket) {
    $scope.usersInAll =[];
    $scope.msgs = [];
    // $scope.numofOnlineUser= $scope.usersInAll.length;
    $scope.numofOnlineUser =0;
  
    $http.get("/rest/user")
    .success(function(users)
    {
        $scope.users = users; 
        $scope.numofOnlineUser = users.length;
    });

    var currentUser = $rootScope.loggedInUser;
    $scope.sendMsg = function () {
        socket.emit('send msg', currentUser+' '+$scope.chat.msg);
        // socket.post('/chat/addconv/',{user:currentUser,message: $scope.chat.msg});
        console.log(currentUser);
        $scope.chat.msg = '';
        // $log.info($scope.chatMessage);
        // $scope.chatMessage = "";
    };
  
    socket.on('get msg', function (data) {
        $scope.msgs.push(data);
        $scope.$digest();
        //Animate
        $(".messages").animate({
            bottom: $(".messages").height() - $(".chatWrap").height()
        }, 250);
        
        // $scope.users.push(user);
        // $scope.$digest();
    });
});

// inmail.controller('inmailController', function ($scope,$rootScope,socket) {
//     $scope.msgs = [];
//     var currentUser = $rootScope.loggedInUser;
//     console.log(currentUser);
//     $scope.sendMsg = function () {
//         socket.emit('send msg', $scope.chat.msg);
//         $scope.chat.msg = '';
//     };

//     socket.on('get msg', function (data) {
//         $scope.msgs.push(data);
//         $scope.$digest();
//     });
// });

