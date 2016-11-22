const test = require('ava');
const nodeGeocoder = require('node-geocoder');
const botMethods = require('./bot-methods');
const config = require('./config');
const congress = require('./congress');

const geocoderOptions = {
  provider: 'google',
  apiKey: config.GOOGLE_API_KEY
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

test('Create Legislator Cards', async t => {
  await congress.locateLegislators(testZip.latitude, testZip.longitude).then(data => {
    const originalDataLength = data.results.length;
    const legislatorCards = botMethods.createLegislatorCards(data.results);
    return t.is(originalDataLength, legislatorCards.length);
  });
});
