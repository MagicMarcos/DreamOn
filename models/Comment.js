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
// PostSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model('Comment', CommentSchema);

// TODO - set expiration same as post
// expireAt: {
//   type: Date,
//   expires: 0,
//   required: true,
// },
// expirationDate: {
//   type: String,
//   required: true,
// },
