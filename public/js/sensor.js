var app = angular.module('sensor-view', ['isDirectives']);

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

app.controller('SensorController', function ($scope, DeviceState) {

  $scope.state = DeviceState.default('sensor', {
    signal: 'low'
  });
  $scope.savedState = DeviceState.empty({
    signal: null
  });

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
