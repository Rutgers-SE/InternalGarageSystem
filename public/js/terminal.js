var app = angular.module('terminal-view', ['isDirectives', 'SocketIO']);

app.controller('terminalController', function($scope, socket, DeviceState) {
  $scope.state = DeviceState.default('terminal', {
    'qr-data': 'apsifjaspodifjaspodijf',
    'action-type': 'reservation'
  });
  $scope.savedState = DeviceState.empty({
    'qr-data': null,
    'action-type': null
  });

  function showBootMessage() {
    // alert some bull here
    socket.emit('dev:trigger', $scope.savedState);
  }

  socket.on('dev:command', function (payload) {
    console.log(payload)
    if (DeviceState.payloadMatch($scope.savedState, payload)) {

      console.log("Incoming payload", payload);

      switch(payload.actions.command) {
        case 'display!':
          showBootMessage();
          break;
        default:
          improperCommand();
      }
    }
  });

});

