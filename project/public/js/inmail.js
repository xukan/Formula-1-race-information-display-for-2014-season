var inmail = angular.module('F1FeederApp.inmail', ['luegg.directives','ui.bootstrap']);

inmail.factory('socket', function () {
    var socket = io.connect('http://formula1-kanexu.rhcloud.com:8000');
    //var socket = io.connect('http://localhost:8000');
    return socket;
});
//http://formula1-kanexu.rhcloud.com/
inmail.controller('inmailController', function ($scope,$rootScope, $http, socket) {
    $scope.usersInAll =[];
    $scope.publicMsgs = [];
    $scope.privateMsg= [];
    $scope.numofOnlineUser =0;
    $scope.isCollapsed = false;
    $scope.oneAtATime = true;
    $http.get("/rest/user")
    .success(function(users)
    {
        $scope.users = users; 
        $scope.numofOnlineUser = users.length;
    });

    var currentUser = $rootScope.loggedInUser;
    
    socket.on('load old msgs', function(docs){
        angular.forEach(docs.reverse(), function(data, key){
            $scope.publicMsgs.push('<b>'+data.sender+':'+'</b>'+data.message);
            $scope.$digest();
        }); 

        $scope.publicMsgs.push('--------------historical messages-------------');
        $scope.$digest();
    });

    //public message
    $scope.sendMsg = function () {
        //socket.emit('send msg', currentUser+' '+$scope.chat.msg);
        socket.emit('send publicMsg', {nick:currentUser, publicMsg:$scope.publicMsg.text});
        // socket.post('/chat/addconv/',{user:currentUser,message: $scope.chat.msg});
        console.log(currentUser);
        console.log($scope.publicMsg.text);
        $scope.publicMsg.text = "";
        // $log.info($scope.chatMessage);
        // $scope.chatMessage = "";
    };

    socket.on('get publicMsg', function (data) {
        $scope.publicMsgs.push('<b>'+data.nick+':'+'</b>'+data.publicMsg);
        //$scope.msgs.push(data);
        $scope.$digest();
    });

    $scope.sendPrivateMsg = function(consignee){
        //$scope.privateMsg="";
        console.log("sendPrivateMsg");
        
        socket.emit('send privateMsg', 
            {sender:currentUser, recipient:consignee.username, privateMsg:consignee.privateMsgText});
        console.log(consignee.privateMsgText);
        console.log(currentUser);
        console.log(consignee.username);
        console.log(consignee.privateMsgText);
        consignee.privateMsgText="";
    };

    socket.on('get privateMsg', function (data) {
        console.log(data);
        $scope.privateMsg.push(data.sender+':'+data.privateMsg);
        
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

