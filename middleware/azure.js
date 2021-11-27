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

const azureAi = async brandURLImage => {
  let DACA = 0;
  let check;
  // !AI checks for DACA
  // URL images containing printed and/or handwritten text.
  // The URL can point to image files (.jpg/.png/.bmp) or multi-page files (.pdf, .tiff).
  const printedTextSampleURL = brandURLImage;
  // Status strings returned from Read API. NOTE: CASING IS SIGNIFICANT.
  // Before Read 3.0, these are "Succeeded" and "Failed"
  const STATUS_SUCCEEDED = 'succeeded';
  const STATUS_FAILED = 'failed';
  // Recognize text in printed image from a URL
  console.log(
    'Read printed text from URL...',
    printedTextSampleURL.split('/').pop()
  );
  const printedResult = await readTextFromURL(
    computerVisionClient,
    printedTextSampleURL
  );
  printRecText(printedResult);

  // Prints all text from Read result
  function printRecText(readResults) {
    console.log('Recognized text:');
    for (const page in readResults) {
      if (readResults.length > 1) {
        console.log(`==== Page: ${page}`);
      }
      const result = readResults[page];
      check = result;
      if (result.lines.length) {
        for (const line of result.lines) {
          console.log('map result', line.words.map(w => w.text).join(' '));
        }
      } else {
        console.log('No recognized text.');
      }
    }
  }
  // Perform read and await the result from URL
  async function readTextFromURL(client, url) {
    // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
    let result = await client.read(url);
    // Operation ID is last path segment of operationLocation (a URL)
    let operation = result.operationLocation.split('/').slice(-1)[0];

    // Wait for read recognition to complete
    // result.status is initially undefined, since it's the result of read
    while (result.status !== STATUS_SUCCEEDED) {
      await sleep(1000);
      result = await client.getReadResult(operation);
    }
    return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
  }

  const resultingArr = check.lines;
  resultingArr.forEach(line => {
    if (line.text.includes('DACA')) {
      console.log('DACAFOUND!');
      DACA = 1;
    }
  });
  return DACA;
};

module.exports = azureAi;
