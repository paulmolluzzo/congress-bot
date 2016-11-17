'use strict';

const rp = require('request-promise-native');

function requestCongressAPI(endpoint, method = 'GET', queryString = {}) {
  return rp({
    uri: `https://congress.api.sunlightfoundation.com/${endpoint}/`,
    qs: queryString,
    method: method
  });
}

exports.locateLegislators = function (zip) {
  return requestCongressAPI('legislators/locate', 'GET', {zip});
};
