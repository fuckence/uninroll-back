import express from 'express';
import {sendEmailWithFiles} from '../controllers/emailController.js';
import { checkAuth } from "../helpers/checkAuth.js";

const router = express.Router();

router.post('/send-email', checkAuth, sendEmailWithFiles);

export default router;