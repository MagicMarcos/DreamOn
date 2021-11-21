const Post = require('../models/Post');
module.exports = {
  getIndex: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: 'desc' }).lean();
      res.render('feed.ejs', { user: req.user, posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
};
