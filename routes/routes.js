const express = require('express');
const { uploadMultiple, downloadFile } = require('../controllers/controller');
const multer = require('multer');
const storage = require('../helpers/utilities').storage; // Assuming utilities.js exports a configured multer storage
const upload = multer({ storage });

const router = express.Router();

router.post('/upload', upload.fields([
    { name: 'unt-cert' },
    { name: 'photo-3x4' },
    { name: 'id-doc' },
    { name: 'attestat' }
]), uploadMultiple);

router.get('/download', downloadFile);

module.exports = router;
