"use strict";

var app = angular.module('gate-device', ['SocketIO', 'isDirectives']);


  function createRandomName(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

function action(w) {
  switch(w) {
    case 'opened':
      return 'open';
      break;
    case 'closed':
      return 'close';
      break;
    default:
      return w;
  }
}

function opposite (s) {
  if (s === 'closed') {
    return 'opened';
  } 
  return 'closed';
}

app.controller("GateController", function ($scope, socket, DeviceState) {
  // TODO: implement this inside the devices directive
  $scope.opposite = opposite;
  $scope.action = action;
  $scope.state = DeviceState.default('gate', {
    arm: 'closed'
  });
  $scope.savedState = {
    deviceType: null,
    name: null,
    status: {
      arm: null
    }
  }


  $scope.toggleStatus = function () {
    $scope.state.status.arm = opposite($scope.state.status.arm);
  };

});

