"use strict";

var app = angular.module('device-panel', ['SocketIO', 'xeditable']);

app.run(function (editableOptions) {
  editableOptions.theme = 'bs3';
});

function openDevFn(dev) {
  return function () {

    var win = window;
    window.open('/devices/' + dev, '_blank');
    win.focus();

  }
};

app.controller('PanelController', function ($scope, socket) {

  $scope.arr = function (obj) { return [obj]; };

  $scope.newGate = openDevFn("gate");
  $scope.newSensor = openDevFn("sensor");
  $scope.newTerminal = openDevFn("terminal");
  $scope.newCamera = openDevFn("camera");

  $scope.devices = {};
  $scope.gate = [];
  $scope.sensor = [];
  $scope.terminal = [];
  $scope.camera = [];
  
  $scope.closeDevice = function (name, dType) {
    console.log("Closing Dev:(" + name + ":" + dType + ")");
    socket.emit("dev:close", {
      name: name,
      deviceType: dType
    });
  };

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
        out[dev.deviceType].push(dev);
      }
    });

    _.each(out, function (value, key) {
      if (key in $scope) {
        $scope[key] = value;
      }
    })

    console.log(out);
  });


  socket.emit('panel:setup');
});

