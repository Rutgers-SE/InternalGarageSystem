

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
      if (!Scanning()) {
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
    name: "entance-gate",
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


// device controller that tells the garage how to sequetially operate devices
function controller() {
  on(eventName, optionMinObj, actionFunction)
  // when customer arrives, the arrival sequence begins
  // it begins when the entrance sensor is activated
  device.on('arrival-sequence')
    .where((obj) => { obj.name == "entrance-sensor"})
    .do((obj) => {
      // the terminal is activated to communicate with the customer
      // this also includes ticket printing
      device.name("entrance-terminal").init((error) => {
        if (error) throw "error message 1"
      });
      device.name("ticket-printer").init((error) => {
        if (error) throw "error message 11"
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
      // spot sensor should stay active until it becomes vacant
    device.on('activate-spot-sensor')
      .where((obj) => {obj.name == "garage-spot-sensor"})
      .do((obj) => {
        device.name("spot-sensor").init((error) => {
          if (error) throw "error message 4"
        });
      });

  device.on('departure-sequence')
    .where((obj) => { obj.name == "spot-sensor"})
    .do((obj) => {
      // departure-sequence initiates
      // when a spot sensor detects a newly vacated spot
      // the terminal is activated to communicate with the customer
      // this also includes ticket reading
      // this when the customer also pays based on the ticket time
      device.name("exit-terminal").init((error) => {
        if (error) throw "error message 5"
      });
      device.name("ticket-reader").init((error) => {
        if (error) throw "error message 51"
      });
      device.name("payment-console").init((error) => {
        if (error) throw "error message 52"
      });
    });
    // when ticket is paid by customer, the gate opens up
    device.on('open-gate')
      .where((obj) => {obj.name == "entrance-terminal"})
      .do((obj) => {
        device.name("exit-gate").init((error) => {
          if (error) throw "error message 6"
        }
      });
    // the gate sensor now makes sure the car has
    // cleared the entrance before closing the gate
    device.on('gate-pass')
      .where((obj) => {obj.name == "gate-sensor"})
      .do((obj) => {
        device.name("exit-gate").init((error) => {
          if (error) throw "error message 7"
        });
        device.name("exit-gate").terminate());
      });


}


/*

FOR REFFERENCE ONLY:

sequence to write in controller:

check for error at every step

arrival-sequence    :

entrance-sensor
terminal screen on
user input (reservation info)
	calculate closest spot in garage
		add spot to ticket
    if reservation
		display reserved time and calculated spot
	else if walkin
		take ticket with qr code
	else
		return error message
gate open
car clears gate
	gate close
spot sensors on
if spot sensor sees car parked
spot sensors off



departure-sequence :

exit-sensor
terminal ask for ticket
user insert ticket
terminal send charge request
approval pass
exit gate open
exit gate close



devices and methods/attr

device

  gate
    entrance-gate{
      open()
      close()
    }

  sensor
    entrance-sensor{
      inRange() : boolean
    }
    gate sensor{
      inRange() : boolean
    }
    spot sensor{
      inRange() : boolean
    }

  camera
    license-plate-reader{
      read()
      record()
    }
  terminal
    entrance-terminal{
      displayParkingInfo()
    }
    exit-terminal{
      requestTicket()
      displayFee()
    }

  qrScanner{
    on()
    emit()
    }

  ticket printer{
    printTicket()
  }

  ticket reader{
    readTicket()
  }

*/
