//var cron = require("node-schedule");

var moment = require('moment');

"use strict";
class Garage {
	constructor(parkingSpaces) {
		this.parkingSpaces = parkingSpaces;
		var timeSlots = 365*24;
		this.reservedTimes = new Array(timeSlots);

		for(var i = 0; i < timeSlots; i++) {
			this.reservedTimes[i] = 0;
		}
/*
		//Keeps array at same size, remove crap and adding crap hourly
		//Not sure where this goes, maybe outside the constructor?
		//Most likely outside the constructor.. but we'll see when the code derps
		var rule = new cron.RecurrenceRule();
		rule.minute = 0;
		cron.scheduleJob(rule, function() {
			reservedTimes.shift();
			reservedTimes.push(0);
		});
*/
	}

	setReservation(startDateObj, endDateObj, curDateObj) {
		var startSection = this.convertToSection(startDateObj, curDateObj);
		var endSection = this.convertToSection(endDateObj, curDateObj);
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

	getAvailableSpaces(dateObj, curDateObj) {
		var section = this.convertToSection(dateObj, curDateObj);
		try {
			return this.parkingSpaces - this.reservedTimes[section];
		} catch(err) {
			return 0;
		}
	}

	getOccupiedSpaces(dateObj, curDateObj) {
		var section = this.convertToSection(dateObj, curDateObj);
		try {
			return this.reservedTimes[section];
		} catch(err) {
			return -1;
		}
	}

	incrementHourTester() {
		this.reservedTimes.shift();
		this.reservedTimes.push(0);
	}

	convertToSection(dateObj, currentTime) {
		if(currentTime.getFullYear() == dateObj.getFullYear()) {
			return dateToHours(dateObj) - dateToHours(currentTime);
		}

		return this.timeSlots - dateToHours(currentTime) + dateToHours(dateObj);
	}

	dateToHours(m) {
		return m.hour() + (24 * (7 * m.week()) * (m.day() + 1));
	}
};

module.exports = Garage;
