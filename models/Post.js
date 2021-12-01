const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  expireAt: {
    type: Date,
    expires: 0,
    required: true,
  },
  expirationDate: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  scholarshipLink: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
    required: true,
  },
  DACA: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', PostSchema);
