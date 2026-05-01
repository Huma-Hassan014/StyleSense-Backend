//tell the app which URL triggers the functions in the controller
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

// Define the endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;