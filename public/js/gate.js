"use strict";

var app = angular.module('gate-device', ['SocketIO']);

app.controller("GateController", function ($scope, socket) {
  $scope.name = "unnamed";
  $scope.savedName = undefined;

  $scope.open = function () {
    // TODO: emit some signal to the backend
    // When the emition was successfull
    $scope.status = 'opened';
  };

  $scope.close = function () {
    // TODO: emit some signal to the backend
    // When the emition was successfull
    $scope.status = 'closed';
  };

  socket.on('dev:name-saved', function (pl) {
    $scope.savedName = pl.name;
  });

  // ditching the registration scheme
  // each socket will represent a device
  // in the system
  $scope.updateName = function () {
    socket.emit('dev:rename', {
      oldName: $scope.savedName,
      newName: $scope.name,
      deviceType: 'gate'
    });
  };


  // initial setup
  socket.emit('dev:setup', {
    deviceType: 'gate',
    name: $scope.name
  })
});

