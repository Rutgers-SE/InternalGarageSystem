"use strict";
// Device
const EventEmitter = require('events');
const util = require('util');




function Device(options) {
  EventEmitter.call(this);
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

camera.on('capture', function (stream) {
  logToTheMongoDb(stream.capture(1,4));
});


// Device Types
var depthSensor = new Device({

    name: "pr-sensor",
    meta: { depthThreshold: -4}
    type: "stream-trigger", // type of sensor
    init: function (q) {
      turnOnSensor(); // fake code that turns on physicall hardware
    },
    on: function (deviceStream) {
      // on is dependent on the type of sensor you are using
      // for a stream trigger this will use difference
      var {newDepth, oldDepth}= marshall(deviceStream);
      var curDepth = newDepth - oldDepth;
      if (curDepth > this.depthThreshold) {
        this.emit("trigger", {
          deviceName: this.name,
          depth: curDepth
        });
      }
    },
    terminate: function () {
      turnOffDevice();
    },
    reboot: function () {
      this.terminate();
      this.init();
    }
});

var gate = new Device({
    name: "ent-gate",
    type: "switch", // type of sensor
    init: function (q) {
      turnOnGate(); // fake code that turns on physicall hardware
    },
    on: function () {
      if (openGate()) {
        return this.emit("switch", {
          status: "open"
        });
      }

      return this.emit("switch", {
        name: this.name,
        status: "closed",
        error: "some error message"
      });
    },
    off: function () {
      if (closeGate()) {
        return this.emit("switch", {
          name: this.name,
          status: "closed"
        });
      }

      return this.emit("switch", {
        name: this.name,
        status: "open",
        error: "some error message"
      });
    },
    terminate: function () {
      turnOffGate();
    },
    reboot: function () {
      this.terminate();
      this.init();
    }

});


function Obj() {
  return this;
}

Obj.prototype.on = function () {
  return this;
};

// fake
function controller() {
  on( eventName, optionalMinObj, actionFunction)
  devices.on('entrance-sequence')
         .where((obj) => { obj.name == "pr-sensor"})
         .do((obj) => {
            devices.name("qr-scanner").init((err) => {
              if (err) throw "this is some error";
            });

            devices.on('open-gate')
                   .where((obj) => {obj.name == "qr-scanner"})
                   .do((obj) => {

                   });

          });
}
