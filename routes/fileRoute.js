import express from 'express';
import multer from 'multer';
import {uploadFiles, getFiles} from '../controllers/fileController.js';
import { checkAuth } from "../helpers/checkAuth.js";
import { storage } from '../helpers/utilities.js';
import fileFieldConfig from "../helpers/fileFields.js";

const router = express.Router();


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const dest = path.join(__dirname, 'uploads', req.body.fullname);
//         if (!fs.existsSync(dest)) {
//             fs.mkdirSync(dest, { recursive: true });
//         }// Ensure directory is created
//         cb(null, dest);
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Naming convention
//     }
// });



const upload = multer({ storage: storage });

router.post('/upload-files', checkAuth, upload.fields(fileFieldConfig.fileFields), uploadFiles);
router.get('/get-files', checkAuth, getFiles);

export default router