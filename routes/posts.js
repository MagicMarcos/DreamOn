const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const postsController = require('../controllers/posts');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

//Post Routes
router.get('/:id', ensureAuth, postsController.getPost);

router.post('/makepost', upload.single('file'), postsController.createPost);

router.post('/:postId', postsController.createComment);

router.delete('/deletePost/:id', postsController.deleteProvPost);

module.exports = router;
