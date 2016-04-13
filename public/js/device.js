"use strict";

var app = angular.module('device-dash', ['SocketIO', 'DeviceViews']);

app.controller('DashController', function ($scope, socket) {

  $scope.devices = {};
  $scope.gate = [];
  $scope.sensor = [];
  $scope.terminal = [];
  

  socket.on('panel:alert', function (devState) {
    console.log(devState);
  });

  // just here to check if something good happened
  socket.on('panel:test', function () {
    console.info("This is a test");
  })

  socket.on('panel:update-devices', function (pl) {
    console.info(pl);
  });


  socket.emit('panel:setup');
});

