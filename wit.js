'use strict';

const winston = require('winston');
const Wit = require('node-wit').Wit;
const witLog = require('node-wit').log;
const botMethods = require('./bot-methods');
const config = require('./config');
const congress = require('./congress');

// first entity value helper from node client quickstart
const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const sessions = {};

const actions = {
  send(request, response) {
    const sessionId = request.sessionId;
    const context = request.context;
    const text = response.text;
    const recipientId = sessions[sessionId].fbid;

    if (recipientId) {
      const legislatorsData = context.legislators;
      if (legislatorsData && legislatorsData.length > 0) {
        return botMethods.sendLegislatorInfo(recipientId, legislatorsData)
        .then(() => null)
        .catch(err => {
          winston.error(err);
        });
      }
      return botMethods.sendTextMessage(recipientId, text.substring(0, 100))
      .then(() => null)
      .catch(err => {
        console.error(
          'Oops! An error occurred while forwarding the response to',
          recipientId,
          ':',
          err.stack || err
        );
      });
    }

    console.error('Oops! Couldn\'t find user for session:', sessionId);
    return new Promise(resolve => {
      return resolve();
    });
  },

  getLegislators({context, entities}) {
    const location = firstEntityValue(entities, 'location');
    return new Promise(resolve => {
      if (!location) {
        context.missingLocation = true;
        delete context.location;
        return resolve(context);
      }


      congress.locateLegislatorsByQuery(location).then(response => {
        context.legislators = response.results;
        delete context.missingLocation;
        return resolve(context);
      });
    });
  }
};

const wit = new Wit({
  accessToken: config.WIT_TOKEN,
  actions,
  logger: new witLog.Logger(witLog.INFO)
});

const findOrCreateSession = fbid => {
  let sessionId;
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
  }
  return sessionId;
};

module.exports = {wit, sessions, findOrCreateSession};
