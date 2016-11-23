'use strict';

const nodeGeocoder = require('node-geocoder');
const rp = require('request-promise-native');
const config = require('./config');

const geocoderOptions = {
  provider: 'google',
  apiKey: config.GOOGLE_API_KEY
};

const geocoder = nodeGeocoder(geocoderOptions);

const congress = {
  requestCongressAPI(endpoint, method = 'GET', queryString = {}) {
    return rp({
      uri: `https://congress.api.sunlightfoundation.com/${endpoint}/`,
      qs: queryString,
      method: method
    }).then(response => {
      return JSON.parse(response);
    }).catch(err => {
      throw new Error(err.message);
    });
  },

  locateLegislators(latitude, longitude) {
    return this.requestCongressAPI('legislators/locate', 'GET', {latitude, longitude});
  },

  locateLegislatorsByQuery(query) {
    return geocoder.geocode(query).then(data => {
      const firstUSLocation = data.find(d => d.countryCode === 'US');
      return this.locateLegislators(firstUSLocation.latitude, firstUSLocation.longitude);
    });
  }
};

module.exports = congress;
