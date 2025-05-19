const express = require('express');
const router = express.Router();
const PublicationController = require('../controllers/publication');
const AuthMiddleware = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/publications/');
    },
    filename: (req, file, cb) => {
        const name_file = "pub_" + Date.now() + "_" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        console.log(name_file);
        cb(null, name_file);
    }
});

const uploads = multer({storage: storage});

router.post('/save', AuthMiddleware.auth, PublicationController.save);
router.get('/detail/:id', AuthMiddleware.auth, PublicationController.detail);
router.delete('/delete/:id', AuthMiddleware.auth, PublicationController.remove);
router.get('/user/:id/:page', AuthMiddleware.auth, PublicationController.user);
router.post('/upload/:id', [AuthMiddleware.auth, uploads.single("file0")], PublicationController.upload);
router.get('/media/:file', AuthMiddleware.auth, PublicationController.media);
module.exports = router;