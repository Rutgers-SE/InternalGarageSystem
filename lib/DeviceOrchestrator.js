"use strict";

var Map = require("collections/map");
const EventEmitter = require('events');
var _ = require('lodash');

class Relay {
  constructor(ico, ogo) {
    this.incoming = ico;
    this.outgoing = ogo;
  }
}

/**
 * Sequence
 *
 * the main datastructure for a seqence is the chain.
 * The chain is an array of arrays that contain the expected payload when
 * triggered. When the expected payload is received, it will emit the proper
 * event then move the chains cursor to the next set of expected events.
 * If the proper payload is not recieved, the chain will store it, and not move
 * the cursor to the next event step.
 */
class Sequence {
  constructor() {
    this.chain = [];
    this.head = 0; // head must be within the bounds of the array;

    // turns true when the previous relay call made the head variable goto 0
    this.looped = false;
  }

  _nextHead() {
    if (this.head + 1 >= this.chain.length) {
      this.looped = true;
      this.head = 0;
      return this.head;
    } else {
      this.looped = false;
      this.head++;
      return this.head;
    }
  }

  /**
   * Adds the relay list to the end of the chain
   *
   * @param {array} relays - an array of relay objects
   * @return {Sequence}
   */
  addRelay(relays) {
    this.chain.push(relays);
    return this;
  }

  /**
   * Returns an array of the payloads that need to be emitted next in the sequence
   *
   * @param {object} payload - The incoming object that will continue the sequence
   * @return {array} - If given the correct payload, will return a list of objects for the outgoing
   *  seqence.
   */
  relay(payload) {
    var parent = this;
    var activeRelays = _.filter(this.chain[this.head], function (rel) {
      return _.isEqual(payload, rel.incoming);
    });

    if (activeRelays.length !== 0) {
      this._nextHead();

      return _.map(activeRelays, function (relay) {
        return relay.outgoing;
      });      
    }
    return [];
  }
}


class DeviceOrchestrator {
  constructor(options) {
    this.io = options.io;
    console.log('io');
    console.log(io);
    this.sequences = {};
  }

  defineSequence(name) {
    this.sequences[name] = new Sequence();
    return this.sequences;
  }

  on(evtname, fn) {
  }
  
  // This starts listening for the first sequence.
  // 
  listen(seqOrder) {
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

// this should and will be loaded from a json file.
// there is so much repetition it makes sense for it to be a config file.
//DO.defineSequence('entrance')
  //.addRelay([new Relay(ico, ogo)])
  //.addRelay([new Relay(ico, ogo)])
  //.addRelay([new Relay(ico, ogo)])
  //.addRelay([new Relay(ico, ogo)])
  //.addRelay([new Relay(ico, ogo)]);


module.exports = {
  DeviceOrchestrator,
  Sequence,
  Relay
};
