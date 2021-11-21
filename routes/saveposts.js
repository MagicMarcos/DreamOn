const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

router.post('/savePost', postsController.createSavedPost);
router.delete('/deletePost/:id', postsController.deletePost);
module.exports = router;
