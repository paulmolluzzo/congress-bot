# <img src="./public/assets/congress.png" width="200px"> Congress Bot

This is a FB Messenger bot that makes it easier to find your the contact information of Senators and Representatives in Congress.

## Setup

This repo has several dependencies to work properly with FB Messenger. You will need a Facebook Page and App that is subscribed to the page, a hosted version of the app with a publicly accessible URL, a Papertrail account for storing logs, a [Wit.ai](https://wit.ai/) account for natural language processing, and a [Google Developers Account](https://developers.google.com/) for the geocoding.

You will need to push your site to a publicly accessible server and URL. This URL is given to Facebook during the app creation process, and you will store the server url as an environment variable. You might consider using [Heroku](https://heroku.com).

```
# SERVER URL
SERVER_URL
```

Then, follow [Facebooks' Quick Start guide](https://developers.facebook.com/docs/messenger-platform/guides/quick-start) to set up a page and an app that subscribes to the page. This allows you to set the following environment variables:

```
# FACEBOOK KEYS
MESSENGER_APP_SECRET
MESSENGER_VALIDATION_TOKEN
MESSENGER_PAGE_ACCESS_TOKEN
FB_MESSENGER_APP_ID
FB_PAGE_ID
```

Review at [Wit.ai's Quick Start](https://wit.ai/docs/quickstart) to get a sense of how it works and learn how to create a new app. The you can set these environment variables:

```
# WIT AI
WIT_AI_APP_ID
WIT_AI_SERVER_TOKEN
```

Setup a new app with access to the Google Maps Geocoding API through [the developer console](https://console.developers.google.com/apis/credentials?project=_), and take the API Key to set these environment variables:

```
# GOOGLE
GOOGLE_API_KEY
```

You should set up an account on [Papertrail](https://papertrailapp.com/) that allows you to log events from the app to a central location. Once you set up a service with Papertrail you can store the environment variables:

```
# PAPERTRAIL
PAPERTRAIL_HOST
PAPERTRAIL_PORT
```

To set these variables, you can copy the file `.env-sample` to `.env` and store the values.

---

©2016 Paul Molluzzo
MIT
