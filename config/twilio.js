// TODO likely wrong path
require('dotenv').config({ path: './config/.env' });

const cfg = {};

cfg.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

// A Twilio number
// Specify in E.164 format, e.g. "+16519998877"
cfg.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

cfg.phoneNum = process.env.number;

cfg.notification = process.env.notification;
// Export configuration object
module.exports = cfg;
