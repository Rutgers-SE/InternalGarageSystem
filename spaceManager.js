"use strict";

class Garage {
	constructor(parkingSpaces) {
		this.currentTime = new Date();
		this.parkingSpaces = parkingSpaces;
		this.timeSlots = 365*24;
		this.reservedTimes = new Array(this.timeSlots);
    console.log(this.currentTime);
    //Initialize the number of reservations for each time slot to zero
		for(var i = 0; i < this.timeSlots; i++) {
			this.reservedTimes[i] = 0;
		}
	}

  //Checks for any descrepencies, then 1up's the reservation time slots
	setReservation(startDateObj, endDateObj) {
		var startSection = this.convertToSection(startDateObj);
		var endSection = this.convertToSection(endDateObj);
    //Check that the date reservation range is valid
		if(startSection < 0 || endSection >= this.timeSlots) {
			console.log("One or moore of the given dates is outside of range.");
			return false;
		}
    //Check each timeslot to make sure there is enough space
    for(var i = startSection; i < endSection; i++) {
      if(this.reservedTimes[i] >= this.parkingSpaces) {
        console.log("Not enough space.");
        return false;
      }
    }
    //Increment reservation number for each time slot
    for(var i = startSection; i < endSection; i++) {
        this.reservedTimes[i] += 1;
    }
    return true;
	}

	getOccupiedSpaces(dateObj) {
		var section = this.convertToSection(dateObj);
    //Check that date given falls within the time slots
		if(section < 0 || section >= this.timeslots) {
			console.log("Date is outside of range.");
			return undefined;
		}
		return this.reservedTimes[section];
	}

	getAvailableSpaces(dateObj) {
		return this.parkingSpaces - this.getOccupiedSpaces(dateObj);
	}

	//Will replace this with a cron job or something later down the line
	incrementHour() {
    //Shift the array down one, then push a new slot to the end.
		this.reservedTimes.shift();
		this.reservedTimes.push(0);
    //Increment the current time by an hour
		this.currentTime = new Date(this.currentTime.getTime() + 60*60000);
	}

  //Converts the given date to the corresponding timeslot array index
	convertToSection(dateObj) {
		return Math.floor((dateObj - this.currentTime) / (1000 * 60 * 60));
	}
};

module.exports = Garage;
