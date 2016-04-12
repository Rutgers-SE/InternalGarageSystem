
var app = angular.module('gate-device', ['SocketIO']);
var socket = io.connect('http://localhost:8080');

app.controller("GateController", function ($scope) {
  $scope.open = function () {
    console.log("should do something");
  };

  $scope.close = function () {
    console.log("awesome");
  };


  $scope.register = function () {
    socket.emit('dev:register', {
      name: $scope.name,
      deviceType: 'gate'
    });
  };


  socket.on('dev:registerd', function (payload) {
  });


  $scope.status = "closed";
  $scope.updateStatus = function () {
  };

  $scope.registrationStatus = "unregisterd";
  $scope.name = "unnamed";
});

