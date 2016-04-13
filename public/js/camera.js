"use strict";

var app = angular.module('camera-device', ['SocketIO', 'isDirectives']);


app.controller("CameraController", function ($scope, socket, DeviceState) {
  // TODO: implement this inside the devices directive
  //$scope.opposite = opposite;
  //$scope.action = action;
  $scope.state = DeviceState.default('camera', {});
  $scope.savedState = {
    deviceType: null,
    name: null,
    status: {}
  }


  $scope.toggleStatus = function () {
    //$scope.state.status.arm = opposite($scope.state.status.arm);
  };

});

