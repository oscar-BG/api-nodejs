const express = require('express');
const router = express.Router();
const FollowController = require('../controllers/follow');
const AuthMiddleware = require('../middlewares/auth');

router.post('/save', AuthMiddleware.auth, FollowController.save);
router.delete('/unfollow/:id', AuthMiddleware.auth, FollowController.unFollow);
router.get('/following/:id?/:page?', AuthMiddleware.auth, FollowController.following);
router.get('/followers/:id?/:page?', AuthMiddleware.auth, FollowController.followers);

module.exports = router;