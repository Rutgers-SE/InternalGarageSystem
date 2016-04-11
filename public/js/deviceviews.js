(function () {
  var app = angular.module('DeviceViews', []);

  app.directive('Device', function () {
    return {
      restrict: 'E',
      template: "<div class='col-sm-4'>" +
        "<ng-transclude>" +
        "</div>"
    }
  });

}());
