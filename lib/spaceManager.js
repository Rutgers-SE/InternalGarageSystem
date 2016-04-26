"use strict";

var fs = require("fs");

class SpaceManager {
	constructor(reservationSpaces, walkInSpaces) {
		this.currentTime = new Date();
		this.reservationSpaces = reservationSpaces;
    this.walkInSpaces = walkInSpaces;
		this.timeSlots = 365*24;
		this.reservedTimes = new Array(this.timeSlots);
    //Initialize the number of reservations for each time slot to zero
		for(var i = 0; i < this.timeSlots; i++) {
			this.reservedTimes[i] = 0;
		}
	}

  getReservedTimes() {
    return this.reservedTimes;
  }

  isfull() {
    for(var i = 1; i < this.timeSlots; i++) {
      if(this.reservedTimes[i] != 200) {
        return false;
      }
    }
    return true;
  }

  checkReservation(startDateObj, endDateObj) {
    if (startDateObj === undefined &&
        endDateObj === undefined) return false;
		var startSection = this.convertToSection(startDateObj);
		var endSection = this.convertToSection(endDateObj);
    //Check that the date reservation range is valid
		if(startSection < 0 || endSection >= this.timeSlots) {
			console.log("One or more of the given dates is outside of range.");
			return false;
		}
    //Check each timeslot to make sure there is enough space
    for(var i = startSection; i < endSection; i++) {
      if(this.reservedTimes[i] >= this.reservationSpaces) {
        console.log("Not enough space.");
        return false;
      }
    }
    return true;
  }

  //Checks for any descrepencies, then 1up's the reservation time slots
	setReservation(startDateObj, endDateObj) {
    if (startDateObj === undefined &&
        endDateObj === undefined) return false;
    console.log(startDateObj);
    console.log(endDateObj);
		var startSection = this.convertToSection(startDateObj);
		var endSection = this.convertToSection(endDateObj);
    if(!this.checkReservation(startDateObj, endDateObj)) {
      return false;
    }
    console.log(startSection);
    console.log(endSection);
    //Increment reservation number for each time slot
    for(var i = startSection; i < endSection; i++) {
        this.reservedTimes[i] += 1;
        console.log(i);
    }
    this.writeToFile();
    return true;
	}

	getReservedSpaces(dateObj) {
		var section = this.convertToSection(dateObj);
    //Check that date given falls within the time slots
		if(section < 0 || section >= this.timeslots) {
			console.log("Date is outside of range.");
			return undefined;
		}
		return this.reservedTimes[section];
	}

	getUnreservedSpaces(dateObj) {
		return this.reservationSpaces - this.getReservedSpaces(dateObj);
	}

	//Will replace this with a cron job or something later down the line
	incrementHour() {
    //Shift the array down one, then push a new slot to the end
		this.reservedTimes.shift();
		this.reservedTimes.push(0);
    //Increment the current time by an hour
    //3.6E6 is miliseconds in hour
		this.currentTime = new Date(this.currentTime.getTime() + 3.6E6);
	}

  //Converts the given date to the corresponding timeslot array index
	convertToSection(dateObj) {
    //3.6E6 is miliseconds in hour
		return Math.floor((dateObj - this.currentTime) / 3.6E6);
	}

  writeToFile() {
    fs.writeFile("./oldReservedTimes.js", JSON.stringify(this.reservedTimes), function(err) {
      if(err) {
            console.log(err);
      } else {
        console.log("Output saved to oldReservedTimes.js.");
      }
    }); 
    fs.writeFile("./oldTime.js", JSON.stringify(this.currentTime), function(err) {
      if(err) {
            console.log(err);
      } else {
        console.log("Output saved to oldTime.js.");
      }
    }); 
  }

  arrayFileThingy() {
    try {
      this.reservedTimes = JSON.parse("./oldReservedTimes.js");
      var oldTime = JSON.parse("./oldTime.js");
    } catch(err) {
      console.log(err);
    }
    var sectionsToShift = Math.abs(this.convertToSection(oldTime));
    for(var i = 0; i < sectionsToShift; i++) {
      this.incrementHour();
    }
  }
};

module.exports = SpaceManager;
