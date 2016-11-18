const test = require('ava');
const nodeGeocoder = require('node-geocoder');
const congress = require('./congress');

const geocoderOptions = {
  provider: 'google'
};

var geocoder = nodeGeocoder(geocoderOptions);

let testCityState;
let testState;
let testZip;

test.before('Get Lat Long for City and State', async () => {
  testCityState = await geocoder.geocode('Chicago, IL').then(data => data[0]);
});

test.before('Get Lat Long for State', async () => {
  testState = await geocoder.geocode('New York').then(data => data[0]);
});

test.before('Get Lat Long for Zip', async () => {
  testZip = await geocoder.geocode('90210').then(data => data[0]);
});

test('Locate Legislators By City and State', t => {
  const locatedLegislators = congress.locateLegislators(testCityState.latitude, testCityState.longitude);

  t.notThrows(locatedLegislators);
});

test('Locate Legislators By State', t => {
  const locatedLegislators = congress.locateLegislators(testState.latitude, testState.longitude);

  t.notThrows(locatedLegislators);
});

test('Locate Legislators By Zip', t => {
  const locatedLegislators = congress.locateLegislators(testZip.latitude, testZip.longitude);

  t.notThrows(locatedLegislators);
});
