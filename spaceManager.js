"use strict";

class Garage {
	constructor(parkingSpaces) {
		this.currentTime = new Date();
		this.parkingSpaces = parkingSpaces;
		this.timeSlots = 365*24;
		this.reservedTimes = new Array(this.timeSlots);

		for(var i = 0; i < this.timeSlots; i++) {
			this.reservedTimes[i] = 0;
		}
	}

	setReservation(startDateObj, endDateObj) {
		var startSection = this.convertToSection(startDateObj);
		var endSection = this.convertToSection(endDateObj);
		if(startSection < 0 || endSection >= this.timeSlots) {
			console.log("One or moore of the given dates is outside of range.");
			return false;
		} else {
			for(var i = startSection; i < endSection; i++) {
				this.reservedTimes[i] += 1;
			}
			return true;
		}
	}

	getOccupiedSpaces(dateObj) {
		var section = this.convertToSection(dateObj);
		if(section < 0 || section >= this.timeslots) {
			console.log("Date is outside of range.");
			return -1;
		}
		return this.reservedTimes[section];
	}

	getAvailableSpaces(dateObj) {
		return this.parkingSpaces - this.getOccupiedSpaces(dateObj);
	}

	//Will replace this with a cron job or something later down the line
	incrementHour() {
		this.reservedTimes.shift();
		this.reservedTimes.push(0);
		this.currentTime = new Date(this.currentTime.getTime() + 60*60000);
	}

	convertToSection(dateObj) {
		return ((dateObj - this.currentTime) / (1000 * 60 * 60)) % 24;
	}
};

module.exports = Garage;
