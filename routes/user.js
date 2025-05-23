const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/user');
const AuthMiddleware = require('../middlewares/auth');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/avatars/');
    },
    filename: (req, file, cb) => {
        const name_file = "avatar_" + Date.now() + "_" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        console.log(name_file);
        cb(null, name_file);
    }
});

const uploads = multer({storage: storage});

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
router.get('/list/:page?', AuthMiddleware.auth, UserController.list);
router.put('/update', AuthMiddleware.auth, UserController.update);
router.post('/upload', [AuthMiddleware.auth, uploads.single("file0")], UserController.upload);
router.get('/avatar/:file', AuthMiddleware.auth, UserController.avatar);

module.exports = router;