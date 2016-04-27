"use strict";

var _ = require('lodash');
var request = require('sync-request');

function checkQr(qrData) {
  let resp = request('GET', 'http://localhost:3000/api/qr_code?qr_data=' + qrData);
  resp.getBody();

  resp === 'true';
}

module.exports = function (doc, options) {
  var devices = [];
  let {PhysicalGarage} = options;

  /**
   * Remove the cyclical reference from the socket.io object
   */
  function serializeDevice(dev) {
    var o = _.cloneDeep(dev);
    if (o.socket !== undefined)
      o.socket = dev.socket.connected;
    return o;
  }

  /**
   * Create a list of serialized device objects that are not cyclical
   */
  function serializeDevices(lst) {
    return _.map(lst, serializeDevice);
  }


  function cleanDevices() {
    //console.log("cleaning Devices", devices);
    devices = _.filter(devices, function ({socket}) {
      return socket.connected;
    });
  }

  /**
   * Updates the WEB panel
   */
  function updatePanel() {
    cleanDevices();
    _.each(devices, function ({deviceType, socket}) {
      var sd = serializeDevices(devices)
      if(deviceType === 'panel'){
        socket.emit('panel:update-devices', {devices: sd});
        socket.emit('panel:oc-update', doc.activeSequences);
      }
    });

    return true;
  }



  // DEFINING HOOKS

  // doc.afterRelayHook((ipl) => {
  //   if (ipl['name'] === 'entrance-terminal') {
  //     checkQr(ipl['status']['qr-data'])
  //   }

  //   return true;
  // });


  doc.beforeRelayHook((pl) => {
    console.log('Emition of incoming payload');
    doc.emit('panel:event-log-stream', {
      direction: 'incoming',
      payload: pl
    });
    return true;
  });

  doc.beforeBroadcastHook((cp) => {
    if (cp['trip'] !== undefined) {
      doc.trip(cp['trip']);
    }
    return true;
  });

  doc.afterBroadcastHook((pl) => {
    console.log("Emiton of outgoing payload");
    doc.emit('panel:event-log-stream', {
      direction: 'outgoing',
      payload: pl
    });
    return true;
  });

  doc.beforeBroadcastHook((pl) => {
    updatePanel();
    return true;
  });

  /**
   * Here is where a remove looped sequences
   */
  doc.afterBroadcastHook((opl) => {

    doc.activeSequences = _.filter(doc.activeSequences, (seq) => {
      if (seq.looped === true) return false;
      else return true;
    });

    // This is something
    updatePanel();

    return true;
  });




  // BASIC EVENT LISTENERS

  doc.on('disconnect', updatePanel);

  // testing events listeners
  doc.on('test:external-device', function (pl) {
    doc.emit('panel:test',pl);
  });


  // DeviceOrchestrator els
  doc.on('doc:reset-head', function (payload) {
    var socket = this;

    var sn = payload.sequenceName;

    var keys = Object.keys(doc.sequences);

    if (sn !== undefined) {
      console.log(`I just reset the ${sn} sequence`)
      doc.sequences[sn].head = 0;
      return;
    }

    // TODO: implement sequence scope reset
    for (let key of keys) {
      doc.sequences[key].head = 0;
    }

    updatePanel();
  });


  // Panel els
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



  // Device els
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

  doc.afterRelayHook((ipl) => {
    if (ipl['deviceType'] === "sensor" &&
        ipl['status']['signal'] === "HI" &&
        ipl['name'] !== 'pre-entrance-terminal' &&
        ipl['name'] !== 'post-entrance-terminal' &&
        ipl['name'] !== 'pre-exit-terminal' &&
        ipl['name'] !== 'post-exit-terminal'){

      let df = null;

      for (let dev of devices) {
        if (dev.name === ipl.name) df = dev;
      }

      // Dealing with the HI parking lot sensor
      doc.emit('dev:update', {
        oldState: df,
        newState: _.merge(df, ipl)
      })
    }


    return true;
  })

  doc.beforeBroadcastHook((opl) => {
    if (opl['deviceType'] === "panel" &&
        opl['status'] !== undefined &&
        opl['status']['command'] === 'turn-all-other-sensors-off!') {

      var devNames = _.filter(devices, (dev) => {
        let matches = dev.name.match(/sensor-.*/)
        if (matches === null) return false;
        return dev.status.signal === 'LOW'
      })

      devNames = _.map(devNames, (dev) => {
        return dev.name;
      })

      console.log(devNames);
      opl.status.args.push(devNames);
    }


    return true;
  })


  return {devices};
};
