const async = require('async');
const fs = require('fs');
const https = require('https');
const path = require('path');
const createReadStream = require('fs').createReadStream;

require('dotenv').config({ path: './config/.env' });
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient =
  require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const key = process.env.MS_COMPUTER_VISION_SUBSCRIPTION_KEY;
const endpoint = process.env.MS_COMPUTER_VISION_ENDPOINT;

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
  endpoint
);

module.exports = {
  computerVisionClient: computerVisionClient,
  sleep: sleep,
};
