const mongoose = require('mongoose');
const moment = require('moment');
const cfg = require('../config/twilio');
const Twilio = require('twilio');

const SavedPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  phoneNumber: { type: String },
  notification: { type: Number },

  time: { type: Date, index: true },
  caption: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  postedBy: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  providerName: {
    type: String,
    required: true,
  },
  scholarshipLink: {
    type: String,
    required: true,
  },
  DACA: {
    type: Number,
    required: true,
  },
  expirationDate: {
    type: String,
    required: true,
  },
  savedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// defining methods and statics
SavedPostSchema.methods.requiresNotification = function (date) {
  console.log(
    'difference',
    Math.round(
      moment
        .duration(moment(this.time).utc().diff(moment(date).utc()))
        .asMinutes()
    )
  );

  // !demo purposes only
  // return this.notification === 5;

  //!production code
  return (
    Math.round(
      moment
        .duration(moment(this.time).utc().diff(moment(date).utc()))
        .asMinutes()
    ) === this.notification
  );
};
SavedPostSchema.statics.sendNotifications = function (callback) {
  // now
  const searchDate = new Date();
  SavedPosts.find().then(function (savedposts) {
    savedposts = savedposts.filter(function (appointment) {
      console.log('appointment search?');
      return appointment.requiresNotification(searchDate);
    });
    if (savedposts.length > 0) {
      console.log('savedpost.length > 0, run sendNotifications');
      sendNotifications(savedposts);
    }
  });

  /**
   * Send messages to all appoinment owners via Twilio
   * @param {array} savedposts List of appointments.
   */

  function sendNotifications(savedposts) {
    const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);
    savedposts.forEach(function (reminder) {
      // Create options to send the message
      const options = {
        to: `+1 ${reminder.phoneNumber}`,
        from: cfg.twilioPhoneNumber,
        body: `Hi ${reminder.name}. The application deadline for ${reminder.title} is coming up on ${reminder.expirationDate}. Don't miss out! Apply now from your account at dreamingon.herokuapp.com `,
      };

      // Send the message!
      client.messages.create(options, function (err, response) {
        if (err) {
          console.error(err);
        } else {
          // Log the last few digits of a phone number
          console.log('sending');
          let masked = reminder.phoneNumber.substr(
            0,
            reminder.phoneNumber.length - 5
          );
          masked += '*****';
          console.log(`Message sent to ${masked}`);
        }
      });
    });

    // Don't wait on success/failure, just indicate all messages have been queued for delivery
    if (callback) {
      callback.call();
    }
  }
};
const SavedPosts = mongoose.model('SavedPost', SavedPostSchema);
module.exports = mongoose.model('SavedPost', SavedPostSchema);
