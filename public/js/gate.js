"use strict";

var app = angular.module('gate-device', ['SocketIO', 'isDirectives']);

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

app.controller("GateController", function ($scope, socket) {
  // TODO: implement this inside the devices directive
  $scope.status = [{
    arm: 'closed'
  }];
  $scope.opposite = opposite;
  $scope.action = action;

  $scope.currentState = function () {
    return $scope.status[0];
  }

  $scope.toggleStatus = function () {
    $scope.status[0].arm = opposite($scope.currentState.arm);
  };


  $scope.updateState = function (mobj) {
    console.log('chaning to ');
    console.log(mobj);
    return function (pl) {
      return _.merge(pl, mobj);
    }
  };

  

});

