const Post = require('../models/Post');
module.exports = {
  getIndex: async (req, res) => {
    try {
      res.render('signup-check.ejs');
    } catch (err) {
      console.log(err);
    }
  },

};
