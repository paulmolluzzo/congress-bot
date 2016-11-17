const test = require('ava');
const congress = require('./congress');

test('Locate Legislators', t => {
  const locatedLegislators = congress.locateLegislators('90210');

  t.notThrows(locatedLegislators);
});
