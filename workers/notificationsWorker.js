const SavedPost = require('../models/SavedPost');

const notificationWorkerFactory = function () {
  return {
    run: function () {
      SavedPost.sendNotifications();
    },
  };
};

module.exports = notificationWorkerFactory();
