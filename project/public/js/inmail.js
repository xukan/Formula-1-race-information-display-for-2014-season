var inmail = angular.module('F1FeederApp.inmail', []);

inmail.factory('socket', function () {
    return io.connect('http://localhost:8000');
});

inmail.controller('inmailController', function ($scope,$rootScope, socket) {
    $scope.msgs = [];
    $scope.users=[];
    var currentUser = $rootScope.loggedInUser;
    $scope.sendMsg = function () {
        socket.emit('send msg', currentUser+' '+$scope.chat.msg);
        console.log(currentUser);
        $scope.chat.msg = '';
    };

    socket.on('get msg', function (user,data) {
        $scope.msgs.push(data);
        $scope.$digest();
        $scope.users.push(user);
        $scope.$digest();
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