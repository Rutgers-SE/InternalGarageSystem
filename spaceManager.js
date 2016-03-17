//var cron = require("node-schedule");
"use strict";
var GarageThing = class GarageThing {
	constructor(parkingSpaces) {
		this.parkingSpaces = parkingSpaces;
		var asdf = 365*24;
		this.potato = new Array(asdf);
		
		for(var i = 0; i < asdf; i++) {
			this.potato[i] = 0;
		}
/*
		//Keeps array at same size, remove crap and adding crap hourly
		//Not sure where this goes, maybe outside the constructor?
		//Most likely outside the constructor.. but we'll see when the code derps
		var rule = new cron.RecurrenceRule();
		rule.minute = 0;
		cron.scheduleJob(rule, function() {
			potato.shift();
			potato.push(0);
		});
*/
	}

	setReservation(startDateObj, endDateObj, curDateObj) {
		var startSection = this.convertToSection(startDateObj, curDateObj);
		var endSection = this.convertToSection(endDateObj, curDateObj);
		if(startSection < 0) {
			console.log("Date has already passed");
		} else if(endSection >= this.asdf) {
			console.log("Date is too far in the future");
		} else {
			for(var i = startSection; i < endSection; i++) {
				this.potato[i] += 1;
			}
		}
	}

	getAvailableSpaces(dateObj, curDateObj) {
		var section = this.convertToSection(dateObj, curDateObj);
		try {
			return this.parkingSpaces - this.potato[section];
		} catch(err) {
			return 0;
		}
	}

	getOccupiedSpaces(dateObj, curDateObj) {
		var section = this.convertToSection(dateObj, curDateObj);
		try {
			return this.potato[section];
		} catch(err) {
			return -1;
		}
	}

	incrementHourTester() {
		this.potato.shift();
		this.potato.push(0);
	}

	convertToSection(dateObj, currentTime) {
		if(currentTime.getFullYear() == dateObj.getFullYear()) {
			var temp = (dateObj.getHours() + 24 * dateObj.getDate() * (dateObj.getMonth() + 1)) - (currentTime.getHours() + 24 * currentTime.getDate() * (currentTime.getMonth() + 1));
			return temp;
		} else {
			var temp = asdf - (currentTime.getHours() + 24 * currentTime.getDate() * (currentTime.getMonth() + 1)) + (dateObj.getHours() + 24 * dateObj.getDate() * (dateObj.getMonth() + 1));
			return temp;
		}
	}
};

module.exports = GarageThing;
