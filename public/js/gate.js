"use strict";

var app = angular.module('gate-device', ['SocketIO', 'isDirectives']);

function createRandomName(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < length; i++ )
  text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


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

app.controller("GateController", function ($scope, socket) {
  $scope.name = "gate-" + createRandomName(5);
  $scope.savedName = undefined;
  $scope.status = 'close';


  $scope.nameSaveState = function () {
    if ($scope.savedName === $scope.name ) {
      return "saved";
    }
    return   "not saved"
  };

  $scope.toggleStatus = function () {
    $scope.status = opposite($scope.status);
  };

  $scope.opposite = opposite;
  $scope.past = past;

  socket.on('dev:name-saved', function (pl) {
    $scope.savedName = pl.name;
  });

  // ditching the registration scheme
  // each socket will represent a device
  // in the system
  $scope.updateName = function () {
    socket.emit('dev:rename', {
      oldName: $scope.savedName,
      newName: $scope.name,
      deviceType: 'gate'
    });
  };

  // initial setup
  socket.emit('dev:setup', {
    deviceType: 'gate',
    name: $scope.name
  })
});

