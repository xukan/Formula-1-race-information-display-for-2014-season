var inbox = angular.module('F1FeederApp.inbox',[]);

inbox.factory('InboxFactory', function InboxFactory ($q, $http, $location) {
    'use strict';
    var exports = {};

    exports.messages = [];
    console.log("inbox");

    exports.getMessages = function (recipientUsername) {
      var deferred = $q.defer();
      return $http.get('/inbox/inmails/' + recipientUsername)
        .success(function (data) {
          exports.messages = data;
          deferred.resolve(data);
        })
        .error(function (data) {
          deferred.reject(data);
        });
      return deferred.promise;
    };

    exports.deleteMessage = function (id, index) {
      this.messages.splice(index, 1);
    }
    
    return exports;
});


inbox.controller('inboxCtrl', function($scope, $rootScope, InboxFactory) {
    InboxFactory.getMessages()
    .success(function(jsonData, statusCode) {
         console.log('The request was successful!', statusCode, jsonData);
         // Now add the Email messages to the controller's scope
         $scope.inmails = jsonData;
    });
    
    $scope.deleteMessage = function (id, index) {
      InboxFactory.deleteMessage(id, index);
    };

    console.log($rootScope);
    
    InboxFactory.getMessages($rootScope.currentUser.username)
    .then( angular.bind( this, function then() {
          this.messages = InboxFactory.messages;
          console.log(this.messages+"InboxFactory");
          $scope.inmails = this.messages;
    }));
});


