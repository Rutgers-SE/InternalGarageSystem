"use strict";
var Map = require("collections/map");
const EventEmitter = require('events');

class Sequence {
  constructor() {
    this.relayMap = new Map();
    this.incommingOrder = [];
  }

  // add Event
  addRelay(incomingEvent, outgoingEvent) {
    this.relayMap.set(incomingEvent, outgoingEvent);
    this.incommingOrder(incomingEvent);
    return this;
  }
}

class DeviceOrchestrator {
  constructor(options) {
    this.io = options.io;
    this.sequences = {};
  }

  defineSequence(name) {
    this.sequences[name] = new Sequence();
    return this.sequences;
  }

  on(evtname, fn) {
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
