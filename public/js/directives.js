(function () {

  function createRandomName(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  angular.module('isDirectives', ['SocketIO'])
  .directive('isDevice', function () {
    return {
      restrict: 'E',
      controller: function ($scope, socket, $window) {
        // {{{
        $scope.name = $scope.deviceType + "-" + createRandomName(5);
        $scope.savedName = undefined;
        socket.on('dev:updated', function (pl) {
          $scope.savedName = pl.name;
        });

        // ditching the registration scheme
        // each socket will represent a device
        // in the system
        $scope.updateName = function () {
          socket.emit('dev:rename', {
            oldName: $scope.savedName,
            newName: $scope.name,
            deviceType: $scope.deviceType
          });
        };

        // initial setup
        socket.emit('dev:setup', {
          deviceType: $scope.deviceType,
          name: $scope.name,
          state: $scope.deviceState
        });

        socket.on('dev:close', function () {
          console.log("Closing Device")
          $window.close();
        });

        $scope.nameSaveState = function () {
          if ($scope.savedName === $scope.name ) {
            return "saved";
          }
          return   "not saved"
        };
        // }}}
      },
      scope: {
        deviceType: '=type',
        deviceState: '=state',
        updateFn: '@update'
      },
      transclude: true,
      template: function () {
        return `
        <div class="panel panel-default">
        <div class="panel-heading">
        <h3>{{deviceType}}:{{savedName}}</h3>
        </div>
        <ng-transclude />
        <div class="panel-footer">

        <div class="form-inline">
        <div class="form-group">
        <div class="input-group">
        <div class="input-group-addon">{{nameSaveState()}}</div>
        <input class="form-control" ng-model="name" value="{{savedName}}" />
        </div>
        <button class="btn btn-primary" ng-click="updateName()">Update Name</button>
        </div>
        </div>

        </div>
        </div>
        `;
      }
    };
  });
}());
