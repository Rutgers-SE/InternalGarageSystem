// Device
const EventEmitter = require('events');
const util = require('util');

function Device() {
  EventEmitter.call(this);
  this.deviceType = undefined;         // Used to determine the specific device type
  this.signalType = "stream";          // default set to stream
  this.name = "undersigned_device";    // Used to designate the specific device
}
util.inherits(Device, EventEmitter);

// Static functions
Device.on = function () {

};

Device.emit = function () {

};

Device.init = function () {

};

Device.terminate = function () {

};

// Dynamic functions:
Device.prototype = {

  on : function () {

  },

  emit : function () {

  },

  log : function () {

  },

  viewDeviceLog : function () {

  }

};

// Device Types
var camera = new Device({
    deviceType : "camera",
    signalType : "stream"
});

var sensor = new Device({
    deviceType : "sensor",
    signalType : "stream"
});

var entranceGate = new Device({
    deviceType : "entranceGate",
    signalType : "switch"
});

var terminal = new Device ({
    deviceType : "terminal",
    signalType : "stream"
});

var qrScanner = new Device({
    deviceType : "qrScanner",
    signalType : "stream"
});
