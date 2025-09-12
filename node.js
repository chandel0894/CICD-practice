const express = require('express');
const { createNewUser, signinUser } = require('../controllers/authController');

const router = express.Router();

// Create new user
router.post("/create-new-user", createNewUser)

// signin user
router.post("/signin-user", signinUser)

module.exports = router;