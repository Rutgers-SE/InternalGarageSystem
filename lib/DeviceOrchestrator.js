class Sequence() {
    constructor() {
        
    }
    
    // add Event
    addRelay(incomingEvent, outgoingEvent) {
        
    }
}

class DeviceOrchestrator {
    constructor() {
        this.sequences = {};
    }
    
    defineSequence(name) {
        this.sequences[name] = new Sequence();
        return this.sequences;
    }
}


map.add({
    'dev:trigger': {
        'name': 'est',
        'meta': {}
    }
},{
    'dev:trigger': {
        'name': 'et',
        'meta': ['qr-scanner']
    }
});






// system <- entrance sensor
//          -> entrance terminal

// system <- (payload) entrance terminal
//          -> e


module.exports = DeviceOrchestrator;