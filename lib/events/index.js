"use strict";

var _ = require('lodash');

module.exports = function (doc) {
  // storing all of the devices in the system
  var devices = [];
  var ev=[];


  function serializeDevices(lst) {
    return _.map(lst, function (pl) {
      var output = _.cloneDeep(pl);
      output.socket = pl.socket.connected;
      return output;
    });
  }

  function serializeDevice(dev) {
    var o = _.cloneDeep(dev);
    if (o.socket !== undefined)
      o.socket = dev.socket.connected;
    return o;
  }

  function cleanDevices() {
    //console.log("cleaning Devices", devices);
    devices = _.filter(devices, function ({socket}) {
      return socket.connected;
    });
  }

  function updatePanel() {
    cleanDevices();
    _.each(devices, function ({deviceType, socket}) {
      var sd = serializeDevices(devices)
      if(deviceType === 'panel'){
        socket.emit('panel:update-devices', {devices: sd});
        socket.emit('panel:oc-update', doc.sequences);
        socket.emit('panel:event-log', ev);
      }
    });
  }

  doc.afterRelayHook(function (pl) {
    updatePanel();
    return true;
  });


  doc.on('doc:reset-head', function (payload) {
    var socket = this;
    var keys = Object.keys(doc.sequences);

    // TODO: implement sequence scope reset
    for (let key of keys) {
      console.log(key);
      console.log(doc.sequences[key].head);
      doc.sequences[key].head = 0;
      console.log(doc.sequences[key].head);
    }

    // after the operation has completed I wan't to emit a signal to
    // the socket that sent the request
    updatePanel();
  });

  doc.on('disconnect', updatePanel);

  doc.on('panel:setup', function (payload) {
    var socket = this;

    devices.push({
      deviceType: 'panel',
      name: 'panel',
      socket
    });

    socket.emit('panel:oc-update', doc.sequences);

    updatePanel();
  });

  // wondering if this should fall into a sequence
  doc.on('dev:setup', function (pl) {
    // TODO: make cleaner
    console.log(`Setting up device ${pl.name}:${pl.deviceType}`);
    var socket = this;
    pl.socket = socket;
    devices.push(pl)
    socket.emit('dev:updated', serializeDevice(pl));
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

  doc.on('dev:update', function ({oldState, newState}) {
    var socket = this;
    devices = _.map(devices, function (dev) {
      if (dev.name === oldState.name && dev.deviceType === oldState.deviceType) {
        console.log("merging(" + oldState.name + " <-- " + newState.name + ")")
        dev =  _.merge(dev, newState);
        dev.socket = socket;
        socket.emit('dev:updated', serializeDevice(dev));
      }
      return dev; 
    });

    updatePanel();

  });

  return {devices, ev};

};
