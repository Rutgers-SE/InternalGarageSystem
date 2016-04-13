"use strict";

var app = angular.module('gate-device', ['SocketIO']);

app.controller("GateController", function ($scope, socket) {
  $scope.open = function () {
  };

  $scope.close = function () {
    console.log("awesome");
  };


  $scope.register = function () {
    socket.emit('dev:register', {
      name: $scope.name,
      deviceType: 'gate'
    });
  };


  socket.on('dev:registered', function (payload) {
    if (payload.deviceName === $scope.name) {
      $scope.registrationStatus = "registered!";
    } 
  });


  $scope.status = "closed";
  $scope.updateStatus = function () {
  };

  $scope.registrationStatus = "unregisterd.";
  $scope.name = "unnamed";
});

