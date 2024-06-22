import { Router } from 'express'
import {register, login, getMe, updateUser, updatePassword} from '../controllers/userController.js'
import { checkAuth } from '../helpers/checkAuth.js'
const router = new Router()

// Register
router.post('/register', register)

// Login
router.post('/login', login)

// Get Me
router.get('/me', checkAuth, getMe)

// Update user
router.put('/update', checkAuth, updateUser)

router.put('/update-password', checkAuth, updatePassword)

export default router