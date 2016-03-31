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

Device.init = function () {
    turnOnDevice();
};

Device.terminate = function () {
    turnOffDevice();
};

var qrScanner = new Device({
    name: "qrScanner",
    type: "stream", // type of sensor
    init: function (q) {
      turnOnQRScanner(); // fake code that turns on physical hardware
    },
    on: function () {
      if (Scanning()) {
        return this.emit("stream", {
          status: "off"
        });
      }

      return this.emit("switch", {
        name: this.name,
        status: "closed",
        error: "error message"
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

var camera = new Device({
    name: "license Reader",
    type: "stream",
    init: function (q) {
        turnOnCamera(); //fake code that turns on physical camera
    },
    on: function (){
        if (qrSuccess()){
            return this.emit("stream",{}
        )};
        }
    },
    terminate: function(){
        turnOffCamera();
    },
    reboot: function () {
      this.terminate();
      this.init();
    }
});
camera.on('capture', function (stream) {
  logToTheMongoDb(stream.capture(1,4));
});


// Device Typjjes
var depthSensor = new Device({

    name: "pr-sensor",
    meta: { depthThreshold: -4}
    type: "stream-trigger", // type of sensor
    init: function (q) {
      turnOnSensor(); // fake code that turns on physical hardware
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

var terminal = new Device ({
    name: "ent-term",
    type: "visual-output",
    init: function (q) {
      turnOnTerminal(); // fake code that turns on physical hardware
    },
    on: function () {
      if (systemOn()) {
        return this.emit("switch", {
          status: "on"
        });
      }
    },
    off: function () {
      if (systemOff()) {
        return this.emit("switch", {
          name: this.name,
          status: "off"
        });
      }
    },
    terminate: function () {
      turnOffTerminal();
    },
    reboot: function () {
      this.terminate();
      this.init();
    }
}

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

// device controller that tells the garage how to sequetially operate devices
function controller() {
  on(eventName, optionMinObj, actionFunction)
  // when customer arrives, the arrival sequence begins
  // it begins when the entrance sensor is activated
  device.on('arrival-sequence')
    .where((obj) => { obj.name == "entrance-sensor"})
    .do((obj) => {
      // the terminal is activated to communicate with the customer
      device.name("entrance-terminal").init((error) => {
        if (error) throw "error message 1"
      });
    });
    // when ticket is taken by customer, the gate opens up
    device.on('open-gate')
      .where((obj) => {obj.name == "entrance-terminal"})
      .do((obj) => {
        device.name("entrance-gate").init((error) => {
          if (error) throw "error message 2"
        }
        device.name("entrance-gate").terminate());
      });
    // the gate sensor now makes sure the car has
    // cleared the entrance before closing the gate
    device.on('gate-pass')
      .where((obj) => {obj.name == "gate-sensor"})
      .do((obj) => {
        device.name("entrance-gate").init((error) => {
          if (error) throw "error message 3"
        });
      });
    device.on('activate-spot-sensor')
      .where((obj) => {obj.name == "garage-spot-sensor"})
      .do((obj) => {
        device.name("spot-sensor").init((error) =>
          if (error) throw "error message 4"
        });
      });
}
