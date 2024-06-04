const path = require('path');
const multer = require('multer');
const fs = require('fs');
const nodemailer = require('nodemailer');

const getFormattedDate = ()=> {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // add leading zero
    const day = ('0' + date.getDate()).slice(-2); // add leading zero
    return `${year}-${month}-${day}`;
}

const formatFullname = (fullname) => {
    return fullname.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fullName = req.body.fullname.replace(/ /g, '_');
        const currentDate = getFormattedDate();
        const dir = `./uploads/${fullName}_${currentDate}`;

        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        // Use the original file name
        cb(null, file.originalname);
    }
});

module.exports = {
    getFormattedDate,
    transporter,
    formatFullname,
    storage
};