"use strict";


/**
 * Simple Data Structure. Right now just counter
 */
class Garage {
  constructor(spaces) {
    this.cap    = spaces;
    this.spaces = spaces;
  }

  acquireSpace(n) {
    if (this.spaces - n >= 0) {
      this.spaces -= n;
      return true;
    }
    return false;
  }

  releaseSpace(n) {
    if (this.spaces + n > this.cap) {
      return false;
    }

    this.spaces  += n;
    return true;
  }

  availbleSpaces() {
    return this.spaces;
  }
}


module.exports = {
  Garage
};

