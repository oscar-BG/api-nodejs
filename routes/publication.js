const express = require('express');
const router = express.Router();
const PublicationController = require('../controllers/publication');
const AuthMiddleware = require('../middlewares/auth');

router.post('/save', AuthMiddleware.auth, PublicationController.save);
router.get('/detail/:id', AuthMiddleware.auth, PublicationController.detail);
router.delete('/delete/:id', AuthMiddleware.auth, PublicationController.remove);
module.exports = router;