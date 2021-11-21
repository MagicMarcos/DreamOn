const Post = require('../models/Post');

module.exports = {
  getPage: async (req, res) => {
    try {
      const post = await Post.find({ postedBy: req.params.id })
        .sort({ createdAt: 'desc' })
        .lean();
      res.render('page.ejs', { posts: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
};
