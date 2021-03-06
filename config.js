'use strict';

// grab env vars
require('dotenv').config({silent: true});

module.exports = {
  APP_SECRET: process.env.MESSENGER_APP_SECRET,
  VALIDATION_TOKEN: process.env.MESSENGER_VALIDATION_TOKEN,
  PAGE_ACCESS_TOKEN: process.env.MESSENGER_PAGE_ACCESS_TOKEN,
  SERVER_URL: process.env.SERVER_URL,
  FB_MESSENGER_APP_ID: process.env.FB_MESSENGER_APP_ID,
  FB_PAGE_ID: process.env.FB_PAGE_ID,
  WIT_TOKEN: process.env.WIT_AI_SERVER_TOKEN,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
};
