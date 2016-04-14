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
    alert("Booting the message");
  }

  socket.on('dev:command', function (payload) {
    if (DeviceState.payloadMatch($scope.savedState.name, payload)) {

      switch(payload.status.command) {
        case 'display':
          showBootMessage();
          break;
        default:
          improperCommand();
      }

    }
  });

});

