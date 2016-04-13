var _ = require('lodash');
"use strict";
module.exports = function (doc) {
  // storing all of the devices in the system
  var devices = [];

  function serializeDevices(lst) {
    return _.map(lst, function (pl) {
      var output = _.cloneDeep(pl);
      output.socket = pl.socket.connected;
      return output;
    });
  }

  function serializeDevice(dev) {
    var o = _.cloneDeep(dev);
    o.socket = dev.socket.connected;
    return o;
  }

  function cleanDevices() {
    devices = _.filter(devices, function ({socket}) {
      return socket.connected;
    });
  }

  function updatePanel() {
    cleanDevices();
    _.each(devices, function ({deviceType, socket}) {
      var sd = serializeDevices(devices)
      if(deviceType === 'panel') 
        socket.emit('panel:update-devices', {devices: sd});
    });
  }

  doc.on('disconnect', updatePanel);

  doc.on('panel:setup', function (payload) {
    var socket = this;

    devices.push({
      deviceType: 'panel',
      name: 'panel',
      socket
    });

    updatePanel();
  });

  // wondering if this should fall into a sequence
  doc.on('dev:setup', function (pl) {
    // TODO: make cleaner
    console.log("Payload");
    console.log(pl);
    var {deviceType, name} = pl;
    var socket = this;
    var tmp = pl;
    socket.emit('dev:updated', tmp);
    pl.socket = socket;
    devices.push(pl)
    updatePanel();
  });

  doc.on('dev:close', function (pl) {
    console.log("Closing device " + pl.name)
    var closedDevSocket = null;
    devices = _.filter(devices, function ({name, deviceType, socket}) {
      if (name === pl.name && deviceType === pl.deviceType) {
        closedDevSocket = socket;
        return false;
      }
      return true;
    });

    if (closedDevSocket !== null) {
      closedDevSocket.emit('dev:close')
      updatePanel();
    }
  });

  doc.on('dev:rename', function ({newName, oldName, deviceType}) {
    var socket = this;

    // TODO: add error handling
    devices = _.map(devices, function (obj) {
      if (obj.name === oldName &&
          obj.deviceType === deviceType) obj.name = newName;
        return obj;
    });

    socket.emit('dev:updated', {name: newName});

    updatePanel();
  });

  doc.on('dev:update', function (pl) {
    var socket = this;
    var {name, deviceType} = pl;
    _.each(devices, function (dev) {
      if (dev.name === name && dev.deviceType === deviceType) {
        _.merge(dev, pl);
        socket.emit('dev:updated', serializeDevice(dev));
        return false; 
      }
    });
  });

};
