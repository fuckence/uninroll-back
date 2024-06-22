import { Router } from 'express';
import {checkAuth} from "../helpers/checkAuth.js";
const router = new Router();
const express = require('express');
const { uploadMultiple, downloadFile } = require('../controllers/controller');
const multer = require('multer');
const storage = require('../helpers/utilities').storage; // Assuming utilities.js exports a configured multer storage
const upload = multer({ storage });

const router = express.Router();

router.post('/upload', checkAuth, upload.fields([
    { name: 'unt-cert' },
    { name: 'photo-3x4' },
    { name: 'id-doc' },
    { name: 'attestat' }
]), uploadMultiple);

module.exports = router;
