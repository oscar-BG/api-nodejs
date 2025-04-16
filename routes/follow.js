const express = require('express');
const router = express.Router();
const FollowController = require('../controllers/follow');
const AuthMiddleware = require('../middlewares/auth');

router.post('/follow', AuthMiddleware.auth, FollowController.save);

module.exports = router;