"use strict";
class Garage {
	constructor(parkingSpaces) {
		this.parkingSpaces = parkingSpaces;
		this.timeSlots = 365*24;
		this.reservedTimes = new Array(this.timeSlots);

		for(var i = 0; i < this.timeSlots; i++) {
			this.reservedTimes[i] = 0;
		}

    this.currentTime = new Date();
	}

	setReservation(startDateObj, endDateObj) {
		var startSection = this.convertToSection(startDateObj);
		var endSection = this.convertToSection(endDateObj);
		if(startSection < 0) {
			console.log("Date has already passed");
		} else if(endSection >= this.timeSlots) {
			console.log("Date is too far in the future");
		} else {
			for(var i = startSection; i < endSection; i++) {
				this.reservedTimes[i] += 1;
			}
		}
	}

	getAvailableSpaces(dateObj) {
		var section = this.convertToSection(dateObj);
    if(section < 0 || section > this.timeslots) {
      return 0;
    }
		return this.parkingSpaces - this.reservedTimes[section];
	}

	getOccupiedSpaces(dateObj, curDateObj) {
		var section = this.convertToSection(dateObj);
    if(section < 0 || section > this.timeslots) {
      return -1;
    }
		return this.reservedTimes[section];
	}
  
  //Will replace this with a cron job or something later down the line
	incrementHour() {
		this.reservedTimes.shift();
		this.reservedTimes.push(0);
    this.currentTime = new Date(this.currentTime.getTime() + 60*60000);
	}

	convertToSection(dateObj) {
    var diffMili = dateObj - this.currentTime;
    return (diffMili / (1000 * 60 * 60)) % 24;
	}
};

module.exports = Garage;
