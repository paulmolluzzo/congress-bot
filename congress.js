'use strict';

const rp = require('request-promise-native');

function requestCongressAPI(endpoint, method = 'GET', queryString = {}) {
  return rp({
    uri: `https://congress.api.sunlightfoundation.com/${endpoint}/`,
    qs: queryString,
    method: method
  }).then(response => {
    return JSON.parse(response);
  }).catch(err => {
    throw new Error(err.message);
  });
}

exports.locateLegislators = function (latitude, longitude) {
  return requestCongressAPI('legislators/locate', 'GET', {latitude, longitude});
};
