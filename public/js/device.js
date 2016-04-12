"use strict";

var app = angular.module('device-dash', ['SocketIO', 'DeviceViews']);

app.controller('DashController', function ($scope, socket) {

  $scope.devices = {};
  $scope.gates = [];


  socket.on('dev:notify', function (pl) {
    alert(pl.meta.deviceName);
    // do some device view things
    $scope[pl.meta.deviceType].push(pl.meta.deviceName);
    
    socket.emit('dev:registered', {
      deviceName: pl.meta.deviceName
    });
  });
});

