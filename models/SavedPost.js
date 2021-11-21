const mongoose = require('mongoose');

const SavedPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
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
// PostSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model('SavedPost', SavedPostSchema);
