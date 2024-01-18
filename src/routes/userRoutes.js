const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const isAuthenticated = userController.isAuthenticated;


router.post('/login', userController.login_post);
router.get('/dashboard', isAuthenticated, userController.dashboard_get);
router.get('/logout', userController.logout_get);

module.exports = router;