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
    var out = {
      gate: [],
      sensor: [],
      terminal: [],
      camera: []
    };
    _.each(pl.devices, function (dev) {
      if (out[dev.deviceType] !== undefined) {
        out[dev.deviceType].push({name: dev.name});
      }
    });

    _.each(out, function (value, key) {
      if (key in $scope) {
        $scope[key] = value;
      }
    })
  });


  socket.emit('panel:setup');
});

