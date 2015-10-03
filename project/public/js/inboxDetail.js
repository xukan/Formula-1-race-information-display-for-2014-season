var inboxDetail = angular.module('F1FeederApp.inboxDetail',[]);

inboxDetail.factory('EmailFactory', function EmailFactory ($q, $rootScope, $http, $routeParams) {
    'use strict';
    var exports = {};
    //$scope.privateMsg= [];
    exports.reply = function (message, consignee) {
        var currentUser = $rootScope.loggedInUser;
        // we would obviously hit the back-end here
        // but let's just alert what we've typed
        alert('Reply content: ' + message);
        //$scope.privateMsg="";
        console.log("sendPrivateMsg");
        
        socket.emit('send privateMsg', 
            {sender:currentUser, recipient:consignee, privateMsg:message});
        console.log(consignee.privateMsgText);
        console.log(currentUser);
        console.log(consignee.username);
        console.log(consignee.privateMsgText);
        message="";
    };

    exports.getMessage = function (params) {
      if ( params) {
        console.log("params:"+params);
        var deferred = $q.defer();
        $http.get('/inbox/inmails/detail/' + params.id)
          .success(function (data) {
            console.log("got the email");
            console.log(data);
            deferred.resolve(data);
          })
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;
      }
    };

    return exports;
  });

inboxDetail.controller('inboxDetailCtrl', function ($routeParams, $scope, EmailFactory) {
    $scope.message = {};
    EmailFactory.reply = function (message) {
      console.log("reply"+message);
      EmailFactory.reply(message);
    };
    var getmessage = EmailFactory.getMessage($routeParams);
    if (getmessage) {
      getmessage.then( angular.bind(this, function (response) {
        EmailFactory.message = response;
        $scope.message = EmailFactory.message;
        console.log($scope.message);
        //$scope.$parent.email.title = this.message.subject;
      }));
    }
});