"use strict";

(function () {

  function createRandomName(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  angular.module('isDirectives', ['SocketIO'])
  .factory('DeviceState', function () {
    return {
      payloadMatch: (state, pl) => {
        return state.name === pl.name;
      },
      default: function (deviceType, status) {
        return {
          deviceType: deviceType,
          name: deviceType + "-" + createRandomName(5),
          status: status
        };
      },
      empty: function (status) {
        return {
          deviceType: null,
          name: null,
          status: status
        };
      }
    }
  })
  .directive('isDevice', function () {
    return {
      restrict: 'E',
      controller: function ($scope, socket, $window) {
        socket.emit('dev:setup', $scope.state);
        // {{{

        $scope.saveObject = function () {
          if (_.isEqual($scope.state, $scope.savedState)) return {
            text: 'fresh',
            className: 'success'
          };

          return { text: 'stale', className: 'danger' }
        };

        // ditching the registration scheme
        // each socket will represent a device
        // in the system

        $scope.updateState = function () {
          console.log($scope.state.name + " --> dev:update");
          socket.emit('dev:update', {
            newState: $scope.state,
            oldState: $scope.savedState
          });
        };

        $scope.deviceTrigger = function () {
          socket.emit('dev:trigger', $scope.state);
        }

        socket.on('dev:updated', function (updatedDeviceObject) {
          _.merge($scope.savedState, updatedDeviceObject);
          _.merge($scope.state, updatedDeviceObject);
        });


        // initial setup
        socket.on('dev:close', function () {
          console.log("Closing Device")
          $window.close();
        });

        $scope.nameSaveState = function () {
          if ($scope.savedState.name === $scope.state.name ) {
            return "saved";
          }
          return   "not saved"
        };
        // }}}
      },
      scope: {
        state: '=state',
        savedState: '=savedState'
      },
      transclude: true,
      template: function () {
        return `
        <div class="panel panel-default">

        <div class="panel-heading">
        <h3>{{state.deviceType}}:{{savedState.name}} <span class="label label-{{saveObject().className}}">{{saveObject().text}}</span></h3>
        </div>

        <ng-transclude />

        <div class="panel-footer">

        <div class="form-inline">
        <div class="form-group">
        <div class="input-group">

        <div class="input-group-addon">{{nameSaveState()}}</div>

        <input class="form-control" ng-model="state.name" value="{{savedState.name}}" />

        </div>


        </div>
        <button class="btn btn-default" ng-click="updateState()">update state</button>
        <button class="btn btn-primary" ng-click="deviceTrigger()">trigger event</button>
        </div>

        </div>
        </div>
        `;
      }
    };
  });
}());


