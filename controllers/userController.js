import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import {body, validationResult} from "express-validator";
import Application from "../models/Application.js";

// Register user
export const register = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is required'),
    body('password')
        .trim()
        .matches(/\S/).withMessage('Password must contain at least one non-whitespace character')
        .isLength({min: 8, max: 50}).withMessage('Password length must be at least 8 characters'),
    body('fullname')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .matches(/^[a-zA-ZÀ-ÿ-]+ [a-zA-ZÀ-ÿ-]+(?: [a-zA-ZÀ-ÿ-]+)?$/).withMessage('Full name must include at least first and last name.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => ({ type: 'error', text: err.msg })),
            });
        }
        try {
            const { email, password, fullname } = req.body
            const isUsed = await User.findOne({ email })

            if (isUsed) {
                return res.status(404).json({ success: false, errors: [{ type: 'error', text: 'This email already exists' }] })
            }

            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

            const newUser = new User({
                email,
                password: hash,
                fullname,
            })

            const token = jwt.sign(
                {
                    id: newUser._id,
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' },
            )

            await newUser.save()

            res.json({
                success: true,
                message: 'Registration successful.',
                newUser,
                token,
            });
        } catch (error) {
            return res.status(400).json({ success: false, errors: [{ type: 'error', text: 'Failed to register'}]})
        }
    }
]

// Login user
export const login = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is required'),
    body('password')
        .trim()
        .matches(/\S/).withMessage('Password must contain at least one non-whitespace character')
        .isLength({min: 8, max: 50}).withMessage('Password length must be at least 8 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => ({ type: 'error', text: err.msg })),
            });
        }
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })

            if (!user) {
                return res.status(404).json({ success: false, errors: [{ type: 'error', text: 'User not found' }] })
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password)

            if (!isPasswordCorrect) {
                return res.status(400).json({ success: false, errors: [{ type: 'error', text: 'Invalid password or email'}]})
            }

            const token = jwt.sign(
                {
                    id: user._id,
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' },
            )

            res.json({
                success: true,
                token,
                user,
                message: 'User updated successfully.'
            })
        } catch (error) {
            return res.status(400).json({ success: false, errors: [{ type: 'error', text: 'Failed to sign in'}]})
        }
    }
]

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.json({
                message: 'This user does not exist',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        )

        res.json({
            user,
            token,
        })
    } catch (error) {
        res.json({ message: 'No access' })
    }
}



// Update user details
export const updateUser = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required'),
    body('email')
        .notEmpty()
        .isEmail().withMessage('Email is required'),
    body('fullname')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .matches(/^[a-zA-ZÀ-ÿ-]+ [a-zA-ZÀ-ÿ-]+(?: [a-zA-ZÀ-ÿ-]+)?$/).withMessage('Full name must include at least first and last name.'),
    body('phoneNumber')
        .trim()
        .matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/)
        .withMessage('Phone number must be in the format +7 (XXX) XXX-XX-XX'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => ({ type: 'error', text: err.msg })),
            });
        }
        try {
            const {username, fullname, email, phoneNumber} = req.body;
            const updatedUser = await User.findByIdAndUpdate(req.userId, {
                $set: {
                    username: username,
                    fullname: fullname,
                    email: email,
                    phoneNumber: phoneNumber
                }
            }, {new: true})  // The { new: true } option ensures the updated document is returned

            if (!updatedUser) {
                return res.status(404).json({ success: false, errors: [{ type: 'error', text: 'User not found' }] })
            }

            const token = jwt.sign(
                {
                    id: updatedUser._id,
                },
                process.env.JWT_SECRET,
                {expiresIn: '30d'},
            )

            res.json({
                success: true,
                user: updatedUser,
                token,
                message: 'User updated successfully.'
            })
        } catch (error) {
            res.status(500).json({ success: false, errors: [{ type: 'error', text: 'Error updating user' }] });
        }
    }
]

export const updatePassword = [
    body('oldPassword')
        .notEmpty().withMessage('Old password is required')
        .isLength({min: 8, max: 50}).withMessage('Old password must be at least 8 characters'),
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({min: 8, max: 50}).withMessage('New password must be at least 8 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => ({ type: 'error', text: err.msg })),
            });
        }

        try {
            const userId = req.userId;
            const { oldPassword, newPassword } = req.body;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, errors: [{ type: 'error', text: 'User not found' }] });
            }

            if(oldPassword === newPassword) {
                return res.status(400).json({ success: false, errors: [{ type: 'error', text: 'New password must not be the same as the old one'}]})
            }
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, errors: [{ type: 'error', text: 'Old password is incorrect' }] });
            }

            // Generate a new password hash
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update the user's password
            user.password = hashedPassword;
            await user.save();

            // Optionally, regenerate the JWT token if needed
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

            res.json({
                success: true,
                message: 'Password updated successfully.',
                token
            });
        } catch (error) {
            res.status(500).json({ success: false, errors: [{type: 'error', text: 'Failed to update password'}] });
        }
    }
]