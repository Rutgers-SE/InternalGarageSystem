(function () {
  var app = angular.module('DeviceViews', []);

  app.directive('isDevice', function () {
    return {
      restrict: 'E',
      template: "<div class='col-sm-4'>" +
        "<ng-transclude>" +
        "</div>"
    }
  });

}());
