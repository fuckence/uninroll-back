import { Router } from 'express'
import { checkAuth } from '../helpers/checkAuth.js'
import {getApplications} from "../controllers/applicationController.js";
const router = new Router()

// Register
router.get('/get-applications', checkAuth, getApplications)

export default router