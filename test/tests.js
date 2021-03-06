"use strict";

var expect = require('chai').expect;
var spaceMan = require('../lib/spaceManager');
var {Garage} = require('../lib/Garage');


describe('Space Manager', function () {
    xdescribe('#getReservedTimes', function () {
        //var sm = new spaceMan(1);
        //expect(sm.getReservedTimes()).to.equal("this wont work... change me!");
    });
    
    xdescribe('#checkReservation', function () {
        //var sm = new spaceMan(200);
    });
});

describe('Garage', function () {
  describe('#acquireSpace', function () {
    it('should increment the count by one and return true', function () {
      var g = new Garage(5);
      expect(g.acquireSpace(1)).to.equal(true);
      expect(g.availbleSpaces()).to.equal(4);
    })

    it('should decrement the count by one and return true', function () {
      var g = new Garage(5);
      expect(g.acquireSpace(1)).to.equal(true);
      expect(g.availbleSpaces()).to.equal(4);
      expect(g.releaseSpace(1)).to.equal(true);
      expect(g.availbleSpaces()).to.equal(5);
    })

    it('should return fals and the keep the count above zero when trying to acquire a space in a full garage', function () {
      var g = new Garage(1);
      expect(g.acquireSpace(1)).to.equal(true);
      expect(g.availbleSpaces()).to.equal(0);
      expect(g.acquireSpace(1)).to.equal(false);
    })

    it('should not release spots higher than the cap', function () {
      var g = new Garage(1);
      expect(g.releaseSpace(1)).to.equal(false);
      expect(g.availbleSpaces()).to.equal(1);
    })
  })
})
