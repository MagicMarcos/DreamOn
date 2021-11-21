const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const postsController = require('../controllers/posts');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

//Main Routes - simplified for now
router.get('/', homeController.getIndex);
// provider profile
router.get('/provider-profile', ensureAuth, postsController.getProfile);
// student profile
router.get('/student-profile', ensureAuth, postsController.getStudentProfile);
// TODO guest page
// make post page
router.get('/make-post', ensureAuth, postsController.getMakePost);
// signup check
router.get('/signup-check', postsController.getSignUpCheck);
// login
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
// logout
router.get('/logout', authController.logout);
// provider sign up
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
// student sign up
router.get('/student-signup', authController.getStudentSignup);
router.post('/student-signup', authController.postStudentSignup);

// TODO student sign up

module.exports = router;
