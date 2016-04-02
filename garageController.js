"use strict";

class Sequence {
}

class GarageController {
  constructor() {
  }



  then(eventName, options = {}) {
  }
}

var ens =  gm.sequence('entrance', {trigger: 'es1'},[
  {'es1': {}},
  {'et': {}},
  {'eg': {},
  {'es2': {}}
]);

gm.sequence('entrance', {trigger: 'es1'})
  .then('et1', {fail: 'lgate'})
  .then('lgate')
  .then('es2')

gm.sequence('entrance', {trigger: 'es2'})
  .then('et1', {fail: 'qt'})
  .then('lgate')
  .then('es2')

var exs =  gm.sequence('exit', [
  {'xs1': {}},
  {'xt': {fail: 'qr'}},
  {'xg': {},
  {'xs2': {}}
]);


