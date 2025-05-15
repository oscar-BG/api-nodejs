const express = require('express');
const router = express.Router();
const PublicationController = require('../controllers/publication');
router.post('/save', PublicationController.save);

module.exports = router;