import path from 'path';
import multer from 'multer';
import fs from 'fs';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

export const getFormattedDate = ()=> {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // add leading zero
    const day = ('0' + date.getDate()).slice(-2); // add leading zero
    return `${year}-${month}-${day}`;
}

export const formatFullname = (fullname) => {
    return fullname.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    }
});

export const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            // Assuming req.userId holds the authenticated user's ID
            const user = await User.findById(req.userId);
            if (!user) {
                cb(new Error('User not found'), null); // Handle no user found
                return;
            }

            // Replace spaces with underscores in the fullname
            const fullName = user.fullname.replace(/ /g, '_');
            const userid = user._id;
            const currentDate = getFormattedDate();
            const dir = `./uploads/${fullName}_${userid}`;

            // Check if the directory exists, if not create it
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        } catch (error) {
            cb(error, null);
        }
    },
    filename: (req, file, cb) => {
        // Prefix the original filename with the field name
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + fileExtension);
    }
});