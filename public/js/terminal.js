var app = angular.module('terminal-view', ['isDirectives']);

app.controller('terminalController', function($scope, DeviceState) {
  //$scope.status="OFF";
  //$scope.devName = "terminal";
  $scope.state = DeviceState.default('terminal', {
  });
  $scope.savedState = DeviceState.empty();
});

//$(function () {
  //var socket = io.connect('http://localhost:8080');
  //$('#qr').click(function () {
    //console.log("Emit that good good");
    //socket.emit('dev:trigger', {
      //'name': 'entrance-terminal-qr'
    //}) 
  //});

  //$("#sensed").mousedown(function () {
    //console.log("This should only happen once");
  //});

  //socket.on("dev:command", function (pl) {
    //if (pl.name === 'entrance-terminal') {
      //alert("Message from command")
    //}
  //});
//});
