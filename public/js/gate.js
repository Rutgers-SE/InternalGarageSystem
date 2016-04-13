"use strict";

var app = angular.module('gate-device', ['SocketIO', 'isDirectives']);

function past(w) {
  switch(w) {
    case 'open':
      return w + 'ed';
      break;
    case 'close':
      return w + 'd';
      break;
    default:
      return w + 'ed';
  }
}

function opposite (s) {
  if (s === 'close') {
    return 'open';
  } 
  return 'close';
}

app.controller("GateController", function ($scope) {
  // TODO: implement this inside the devices directive

  $scope.status = 'close';
  $scope.opposite = opposite;
  $scope.past = past;

  $scope.toggleStatus = function () {
    $scope.status = opposite($scope.status);
  };

});

