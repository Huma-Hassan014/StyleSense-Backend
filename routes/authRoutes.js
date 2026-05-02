//tell the app which URL triggers the functions in the controller
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const authMiddleware = require('../middleware/authMiddleware');

// Define the endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/logout', authMiddleware, authController.logout);

module.exports = router;