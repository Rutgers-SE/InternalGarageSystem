(function () {
  angular.module('isDirectives', ['SocketIO'])
  .directive('isDevice', function () {
    return {
      restrict: 'E',
      controller: function ($scope, socket) {
        $scope.savedName = undefined;

        $scope.nameSaveState = function () {
          return "testing";
        };

      },
      scope: {
        deviceType: '=type'
      },
      template: function () {
        return `
        <h3>{{deviceType}}</h3>
        <div class="form-inline">
        <div class="form-group">
        <div class="input-group">
        <div class="input-group-addon">{{nameSaveState()}}</div>
        <input class="form-control" ng-model="name" value="{{savedName}}" />
        </div>
        <button class="btn btn-primary" ng-click="updateName()">Update Name</button>
        </div>
        </div>
        `;
      }
    };
  });
}());
