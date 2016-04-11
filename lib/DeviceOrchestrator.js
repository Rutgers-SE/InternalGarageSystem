"use strict";

var Map = require("collections/map");
const EventEmitter = require('events');

class EventNode {

  constructor() {
    this.events = [];
  }

  event(event) {

    return this;
  }

}


// Sequence
//
// the main datastructure for a seqence is the chain.
// The chain is an array of arrays that contain the expected payload when
// triggered. When the expected payload is received, it will emit the proper
// event then move the chains cursor to the next set of expected events.
// If the proper payload is not recieved, the chain will store it, and not move
// the cursor to the next event step.
class Sequence {
  constructor() {
    
    // contains the event chain
    this.chain = [];
  }

  // add Event
  addRelay(incomingEvent, outgoingEvent) {
    this.chain.add(incomingEvent, outgoingEvent);
    return this;
  }
}

class DeviceOrchestrator {
  constructor(options) {
    this.io = options.io;
    console.log('io');
    this.sequences = {};
  }

  defineSequence(name) {
    this.sequences[name] = new Sequence();
    return this.sequences;
  }

  on(evtname, fn) {
  }
  
  // This starts listening for the first sequence.
  listen() {
    this.io.on('connection', function (socket) {
      socket.on('dev:trigger', function (payload) {
        console.log("awesome");
      });
      _.each(Object.keys(this.sequences), (sec) => {
      });
    });
  }
}

//var DO = new DeviceOrchestrator();

//DO.defineSequence('entrance')
  //.addRelay({'dev:trigger': {name: 'entrance-sensor-1', meta: {}}}, 
            //{'dev:trigger': {name: 'entrance-terminal', payload: ['display!']}})
  //.addRelay({'dev:trigger': {name: 'entrance-terminal', payload: ['qr-data']}}, 
            //{'dev:trigger': {name: 'entrance-gate', payload: ['open!']}})
  //.addRelay({'dev:trigger': {name: 'entrance-gate', payload: ['opened']}})
  //.addRelay([
    //{'dev:trigger': {name: 'entrance-sensor-2', payload: ['HI']}},  
    //{'dev:trigger': {name: 'entrance-sensor-2', payload: ['LOW']}},  
  //],
  //{'dev:trigger': { name: 'entrance-gate', payload: ['close!']}})
  //.addRelay({'dev:trigger': {name: 'entrance-gate', payload: ['closed']}});


module.exports = DeviceOrchestrator;
