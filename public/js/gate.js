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

  /**
   * opens the arm and sends the state
   */
  function openArm() {
    alert("The entrance gate received a command to open the arm");
    $scope.state.status.arm = 'opened';
    socket.emit('dev:trigger', $scope.state);
  }

  function closeArm() {
    alert("The entrance gate received a command to close the arm");
    $scope.state.status.arm = 'closed';
    socket.emit('dev:trigger', $scope.state);
  }

  socket.on('dev:command', function (payload) {
    console.log(payload)
    if (DeviceState.payloadMatch($scope.savedState, payload)) {

      console.log("Incoming payload", payload);

      switch(payload.actions.command) {
        case 'open!':
          openArm();
          break;
        case 'close!':
          closeArm();
        default:
          improperCommand();
      }
    }
  });

});

