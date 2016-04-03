var expect = require('chai').expect;
var spaceMan = require('../spaceManager');


describe('Space Manager', function () {
    describe('#getReservedTimes', function () {
        var sm = new spaceMan(200);
        
        expect(sm.getReservedTimes()).to.be("this wont work... change me!");
    });
    
    describe('#checkReservation', function () {
        var sm = new spaceMan(200);
        
        

    });
});