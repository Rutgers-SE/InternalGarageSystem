"use strict";

var app = angular.module('device-panel', ['SocketIO', 'xeditable', 'ngSanitize']);

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

app.controller('PanelController', function ($scope, socket, $sce) {

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
  $scope.events = []

  $scope.ch = 0;
  $scope.currentHead = function (chain) {
    return [];
  };

  $scope.resetHead = function (name) {
    if (name !== undefined) {
    socket.emit('doc:reset-head', {sequenceName: name});
    }
    socket.emit('doc:reset-head');
  };

  
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


  $scope.headNode = function (i1, i2) {
    console.log(i1, i2);
    if (i1 === i2) {
      return {
        classString: "label label-info",
        text: "head"
      }

    }
    else {};
  }

  // recieve the sequence object
  socket.on('panel:oc-update', function (doc) {
    window.doc = doc;
    $scope.sequences = doc;
  });

  socket.on('panel:event-log-stream', function (eventObject) {
    $scope.events.push(eventObject);
  });

  //socket.on('panel:event-log', function (pl) {
    //console.log(pl);
    //$scope.events = pl;
  //});

  socket.emit('panel:setup');
});

