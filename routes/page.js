const express = require('express');
const router = express.Router();
const pageController = require('../controllers/page');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

//Post Routes - simplified for now
router.get('/:id', ensureAuth, pageController.getPage);

module.exports = router;
