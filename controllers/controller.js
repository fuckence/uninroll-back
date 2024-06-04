const fs = require('fs');
const path = require('path');
const { formatFullname, getFormattedDate, transporter } = require('../helpers/utilities');
const nodemailer = require('nodemailer');

const uploadMultiple = async (req, res) => {
    const files = req.files;
    const fullName = formatFullname(req.body.fullname.replace(/ /g, '_'));
    const currentDate = getFormattedDate();
    const dir = `./uploads/${fullName}_${currentDate}`;
    let fileDetails = '';
    for (const fileKey in req.files) {
        req.files[fileKey].forEach(file => {
            fileDetails += `${file.fieldname}: ${file.originalname}\n`;
        });
    }

    const attachments = Object.keys(files).reduce((acc, key) => {
        return acc.concat(files[key].map(file => ({
            filename: file.originalname,
            path: file.path
        })));
    }, []);

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: 'yucanmor@gmail.com',
        subject: 'University Application Student',
        text: `Fullname: ${fullName}\nFile details:\n${fileDetails}.`,
        attachments
    };

    try {
        console.log(process.env.GMAIL_USER);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.send('Files uploaded and email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
};

const downloadFile = (req, res) => {
    // Code to handle file download
};

module.exports = {
    uploadMultiple,
    downloadFile
};