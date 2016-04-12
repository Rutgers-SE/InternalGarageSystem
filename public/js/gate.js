$(function () {

  var app = angular.module('GateDevice', ['SocketIO']);

  app.controller("GateController", function ($scope, socket) {
    $scope.open = function () {};
    $scope.close = function () {};
    $scope.status = "closed";
    $scope.updateStatus = function () {
    };
  });

});
