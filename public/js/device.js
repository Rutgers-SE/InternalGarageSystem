"use strict";

var app = angular.module('device-dash', ['SocketIO', 'DeviceViews']);

app.controller('DashController', function ($scope, socket) {

  $scope.devices = {};
  $scope.gate = [];


  socket.on('dev:notify', function (pl) {
    // do some device view things
    $scope[pl.meta.deviceType].push(pl.meta.deviceName);
    console.log(pl.meta.deviceType);
    
    socket.emit('dev:registered', {
      deviceName: pl.meta.deviceName
    });
  });
});

