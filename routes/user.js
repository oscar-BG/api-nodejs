const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const AuthMiddleware = require('../middlewares/auth');

router.get('/private', AuthMiddleware.auth, (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Ruta de acceso privado",
        user : req.user
    });
});
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile/:id', AuthMiddleware.auth, UserController.profile);

module.exports = router;