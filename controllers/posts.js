const cloudinary = require('../middleware/cloudinary');
// Models
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const SavedPost = require('../models/SavedPost');
// Azure Ai
const azureAi = require('../middleware/azure');
// const computerVisionClient = azure.computerVisionClient;
// const sleep = azure.sleep;
// Twilio
const cfg = require('../config/twilio');
const moment = require('moment');
module.exports = {
  // !profiles
  // provider profile
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ postedBy: req.user.id })
        .sort({ createdAt: 'desc' })
        .lean();
      res.render('provider-profile.ejs', { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // student profile
  getStudentProfile: async (req, res) => {
    try {
      const posts = await SavedPost.find({ savedBy: req.user.id })
        .sort({ createdAt: 'desc' })
        .lean();
      res.render('student-profile.ejs', { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // guest profile
  // !signup check
  getSignUpCheck: async (req, res) => {
    try {
      res.render('signup-check.ejs');
    } catch (err) {
      console.log(err);
    }
  },

  // !post page
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({ postId: req.params.id });
      // todo comments
      res.render('post.ejs', {
        post: post,
        comments: comments,
        user: req.user,
      });
    } catch (err) {
      console.log(err);
    }
  },
  // !signup check
  getMakePost: async (req, res) => {
    try {
      res.render('make-post.ejs', { user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // !create posts
  // post scholarship
  createPost: async (req, res) => {
    try {
      const user = req.user._id;
      const userName = req.user.name;
      const scholarshipLink = req.body.scholarshipLink;
      const expirationDate = req.body.expiryDate;
      const expireAt = new Date(req.body.expiryDate);
      const result = await cloudinary.uploader.upload(req.file.path);
      const brandURLImage = result.secure_url;

      if (
        scholarshipLink.toLowerCase()[0] === 'h' &&
        scholarshipLink.toLowerCase().includes('http')
      ) {
        let DACA = await azureAi(brandURLImage);

        await Post.create({
          expireAt: new Date(expireAt),
          expirationDate: expirationDate,
          title: req.body.title,
          caption: req.body.caption,
          image: result.secure_url,
          cloudinaryId: result.public_id,
          userName: userName,
          postedBy: user,
          DACA: DACA,
          scholarshipLink: scholarshipLink,
        });
        console.log('Post has been added!');
        res.redirect('/provider-profile');
      } else {
        res.redirect('/make-post');
      }
    } catch (err) {
      console.log(err);
    }
  },
  // !Save post
  createSavedPost: async (req, res) => {
    try {
      const user = req.user._id;
      const userName = req.user.email;
      const name = req.user.name;
      // other phone numbers not supported with current twilio account
      const phoneNumber = req.user.phoneNumber;
      // one week in minutes (app alerts users 1 week before due date) -> not being used for demo day
      const notification = 10080;
      const postId = req.body.postId;
      const providerName = req.body.providerName;
      const postedBy = req.body.postedBy;
      const expirationDate = req.body.expiryDate;
      const DACA = req.body.DACA;
      const time = moment(expirationDate);
      const scholarshipLink = req.body.scholarshipLink;

      await SavedPost.create({
        title: req.body.title,
        caption: req.body.caption,
        userName: userName,
        postedBy: postedBy,
        postId: postId,
        providerName: providerName,
        savedBy: user,
        DACA: Number(DACA),
        expirationDate: expirationDate,
        name: name,
        // other phone numbers not supported with current twilio account
        phoneNumber: cfg.phoneNum,
        // change notification number based on the difference consoled
        notification: 305,
        time: time,
        scholarshipLink: scholarshipLink,
      });
      console.log('Post has been added!');
      res.redirect(`/student-profile`);
    } catch {}
  },
  // !Comment on Post
  createComment: async (req, res) => {
    let userName = req.user.name;
    let profileType = req.user.profileType;
    let postId = req.params.postId;
    console.log('commentId =>', postId);
    let expireAt = req.body.expirationDate;
    try {
      await Comment.create({
        expireAt: new Date(expireAt),
        comment: req.body.comment,
        postId: postId,
        userName: userName,
        profileType: profileType,
      });
      console.log('Post has been added!');
      res.redirect(`/post/${postId}`);
    } catch {}
  },

  // !delete
  // student post delete
  deletePost: async (req, res) => {
    try {
      // Delete post from db
      await SavedPost.remove({ _id: req.params.id });
      console.log('Deleted Post');
      res.redirect(`/student-profile`);
    } catch (err) {
      console.log(err);
      res.redirect(`/student-profile`);
    }
  },
  // provider post delete
  deleteProvPost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });

      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);

      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log('Deleted Post');
      res.redirect(`/provider-profile`);
    } catch (err) {
      console.log(err);
      res.redirect(`/provider-profile`);
    }
  },
  // *sample put request
  // likePost: async (req, res) => {
  //   try {
  //     await Post.findOneAndUpdate(
  //       { _id: req.params.id },
  //       {
  //         $inc: { count: 1 },
  //       }
  //     );
  //
  //     res.redirect(`/post/${req.params.id}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
};
