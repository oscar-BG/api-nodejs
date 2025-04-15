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
        cb(null, "avatar_" + Date.now() + "_" + file.originalname);
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

module.exports = router;