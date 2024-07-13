import express from 'express';
import multer from 'multer';
import {uploadFiles, getFiles} from '../controllers/fileController.js';
import { checkAuth } from "../helpers/checkAuth.js";
import { storage } from '../helpers/utilities.js';
import fileFieldConfig from "../helpers/fileFields.js";

const router = express.Router();

const upload = multer({ storage: storage });

router.post('/upload-files', checkAuth, upload.fields(fileFieldConfig.fileFields), uploadFiles);
router.get('/get-files', checkAuth, getFiles);
router.get('/get-one-file', checkAuth, getFiles);

export default router