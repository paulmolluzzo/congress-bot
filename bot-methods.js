'use strict';

const winston = require('winston');
const rp = require('request-promise-native');
const config = require('./config');

const botMethods = {
  checkMessage(pattern, msg) {
    const rePattern = new RegExp(pattern, 'i');
    return rePattern.test(msg);
  },

  receivedMessage(event) {
    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfMessage = event.timestamp;
    const message = event.message;
    const isEcho = message.is_echo;

    if (isEcho) {
      return;
    }

    // You may get a text or attachment but not both
    const messageText = message.text;

    // if there's no message then there's an attachment
    if (!messageText) {
      return this.sendGifMessage(senderID).then(() => {
        return this.sendTextMessage(senderID, `Thanks for the attachment!`);
      });
    }

    winston.info('Received message for user %d and page %d at %d with message: %s', senderID, recipientID, timeOfMessage, messageText);

    if (this.checkMessage('gif', messageText)) {
      return this.sendGifMessage(senderID);
    }

    if (this.checkMessage('hey', messageText)) {
      return this.sendTextMessage(senderID, `Hey is for horses. 😂`);
    }

    winston.warn('Unhandled message: %s', messageText);
    return this.sendTextMessage(senderID, `That's a new one.`);
  },

  receivedAuthentication(event) {
    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfAuth = event.timestamp;

    // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
    // The developer can set this to an arbitrary value to associate the
    // authentication callback with the 'Send to Messenger' click event. This is
    // a way to do account linking when the user clicks the 'Send to Messenger'
    // plugin.
    const passThroughParam = event.optin.ref;

    winston.info('Received authentication for user %d and page %d with pass through param %s at %d', senderID, recipientID, passThroughParam, timeOfAuth);

    // When an authentication is received, we'll send a message back to the sender
    // to let them know it was successful.
    this.sendTextMessage(senderID, 'Authentication successful');
  },

  receivedDeliveryConfirmation(event) {
    const delivery = event.delivery;
    const messageIDs = delivery.mids;
    const watermark = delivery.watermark;

    if (messageIDs) {
      messageIDs.forEach(messageID => {
        winston.info('Received delivery confirmation for message ID: %s', messageID);
      });
    }

    winston.info('All messages before %d were delivered.', watermark);
  },

  sendSenderAction(recipientId, actionType) {
    const messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: actionType
    };

    return this.callSendAPI(messageData);
  },

  sendMarkSeen(recipientId) {
    return this.sendSenderAction(recipientId, 'mark_seen');
  },

  sendTypingOn(recipientId) {
    return this.sendSenderAction(recipientId, 'typing_on');
  },

  sendTypingOff(recipientId) {
    return this.sendSenderAction(recipientId, 'typing_off');
  },

  sendTextMessage(recipientId, messageText) {
    const messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText
      }
    };

    return this.sendTypingOn(recipientId).then(() => {
      this.callSendAPI(messageData);
    });
  },

  sendHelpMessage(recipientId) {
    const messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: `Need some help? You can send the following messages:`
      }
    };

    return this.callSendAPI(messageData);
  },

  callSendAPI(messageData) {
    return rp({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: config.PAGE_ACCESS_TOKEN},
      method: 'POST',
      json: messageData
    }).then(body => {
      const recipientId = body.recipient_id;
      const messageId = body.message_id;
      let messageType = messageData.sender_action || 'text';

      if (messageData.message !== undefined && messageData.message.attachment !== undefined) {
        messageType = messageData.message.attachment.type;
      }

      winston.info('Successfully sent %s message with id %s to recipient %s', messageType, messageId, recipientId);
    }).catch(err => {
      winston.error('Unable to send message.', err);
    });
  },

  sendGenericMessage(recipientId, elements) {
    const messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: elements
          }
        }
      }
    };

    return this.sendTypingOn(recipientId).then(() => {
      this.callSendAPI(messageData);
    });
  },

  sendGifMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: `${config.SERVER_URL}/assets/robot.gif`
          }
        }
      }
    };

    return this.callSendAPI(messageData);
  },

  receivedPostback(event) {
    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    const payload = event.postback.payload;

    winston.info('Received postback for user %d and page %d with payload %s at %d', senderID, recipientID, payload, timeOfPostback);

    // When a postback is called, we'll send a message back to the sender to
    // let them know it was successful
    this.sendTextMessage(senderID, `${payload}`);
  }
};

module.exports = botMethods;
