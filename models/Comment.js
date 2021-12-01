const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  expireAt: {
    type: Date,
    expires: 0,
    required: true,
  },
  profileType: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', CommentSchema);
