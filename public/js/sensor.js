var app = angular.module('sensor-view', ['isDirectives', 'ngRoute']);

app.config(function($routeProvider){
  $routeProvider.when(
    "/:name",
    {
      controller: "SensorController",
      controllerAs: "sensor"
    }
  );
})


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
  if (s === 'LOW') {
    return 'HI';
  } 
  return 'LOW';
}

app.controller('SensorController', function ($scope, DeviceState, $routeParams) {

  $scope.state = DeviceState.default('sensor', {
    signal: 'LOW'
  });
  $scope.savedState = DeviceState.empty({
    signal: null
  });

  $scope.toggleState = function () { 
    let self = this;
    // alert(`${$routeParams.name}`)
    $scope.state.status.signal = opposite($scope.state.status.signal);
  };

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
