"use strict";

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
  /**
   * validPayload
   *
   * @param {object} payload - is the payload that was just recieved by the system
   * @param {object} incoming - is the payload that was modeled in the system.
   * @return {array} 
   */
  static validPayload(payload, incoming) {
    var keys = Object.keys(incoming);

    for (let key of keys) {
      if (payload[key] === undefined) {
        return false;
      }
    }

    return true;
  }

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
   * @return {array} - If given the correct payload, will return a list of objects for the outgoing seqence.
   */
  relay(payload) {
    var parent = this;
    var activeRelays = _.filter(this.chain[this.head], function (rel) {
      // might be too loose
      return Sequence.validPayload(payload, rel.incoming);
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


// need to figureout how to run the sequences in parallel
class DeviceOrchestrator {
  constructor(options) {
    this.io = options.io;
    this.sequences = {};

    // The home of the hooks
    this.brh = [];
    this.afh = [];
    this.bbh = [];
    this.abh = [];
  }

  defineSequence(name) {
    this.sequences[name] = new Sequence();
    this.as = name;
    return this.sequences[name];
  }

  _activeSequence() {
    return this.sequences[this.as];
  }
  
  // This starts listening for the first sequence.
  // 
  listen(seqOrder) {
    var self = this;
    this.io.on('connection', function (socket) {
      console.log("new socket");
      socket.on('dev:trigger', function (payload) {

        var cont = self._beforeRelayHooks(payload);
        if (!cont) return;
        var outgoingPayloads = self._activeSequence().relay(payload);
        cont = self._afterRelayHooks(payload);
        if (!cont) return;

        _.each(outgoingPayloads, function (pl) {
          var cont = self._beforeBroadcastHooks(pl);
          if (!cont) return;
          socket.broadcast.emit('dev:command', pl);
          cont = self._afterBroadcastHooks(pl);
          if (!cont) return;
        });
      });
    });
  }

  _addHook(lst, fn) {
    this[lst].push(fn);
  }

  beforeRelayHook(fn) { this._addHook('brh', fn); }
  afterRelayHook(fn) { this._addHook('arh', fn); }
  beforeBroadcastHook(fn) { this._addHook('bbh', fn); }
  afterBroadcastHook(fn) { this._addHook('abh', fn); }

  _runHooks(map, payload) {
    var ogSize = this[map].length;
    var outcome = _.filter(this[map], function (fn) {
      return fn(payload);
    });

    if (ogSize != outcome.length) return false;
    return true;
  }

  _beforeRelayHooks(payload) { return this._runHooks("brh", payload); }
  _afterRelayHooks(payload) { return this._runHooks("arh", payload); }

  _beforeBroadcastHooks(payload) { return this._runHooks("bbh", payload); }
  _afterBroadcastHooks(payload) { return this._runHooks("abh", payload); }
}


module.exports = {
  DeviceOrchestrator,
  Sequence,
  Relay
};
