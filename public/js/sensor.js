var app = angular.module('sensor-view', ['isDirectives']);

app.controller('SensorController', function ($scope) {
  $scope.stateText = "Switch to HI";
  $scope.pageStatus = "LO";
  $scope.toggleSignal = function(){
    if ($scope.stateText === "Switch to HI"){
      $scope.stateText = "Switch to LO";
      $scope.pageStatus = "HI";
    }
    else{
      $scope.stateText = "Switch to HI";
      $scope.pageStatus = "LO";
    }
  };
});

//var socket = io.connection();
//socket.emit("device:register",{
  //name:$scope.name,
  //devType:"Sensor"
//});
//socket.on("device:register", function(payload){
    
//});
  

//$(function () {
  //var socket = io.connect('http://localhost:8080');
   //$('#sensed').click(function () {
      //socket.emit('dev:trigger', {
        //'name': 'entrance-pre-term-sensor',
        //'meta': {
          //'status': true
        //},
      //}) 
   //});

   //$("#sensed").mousedown(function () {
     //console.log("This should only happen once");
   //});

   //socket.on("dev:command", function (data) {
     //console.log(data);
   //});
//});
