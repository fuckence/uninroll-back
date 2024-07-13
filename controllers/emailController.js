import nodemailer from 'nodemailer';
import imaps from 'imap-simple';
import User from '../models/User.js'
import File from '../models/File.js'
import path from "path";
import dotenv from 'dotenv'
dotenv.config();

export const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});

const imapConfig = {
    imap: {
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASS,
        host: 'imap.mail.ru',
        port: 993,
        tls: true,
        authTimeout: 3000
    }
};

const fileDisplayNames = {
    'uni-cert': 'UNI Certificate',
    'photo-3x4': 'Photo 3x4',
    'attestat': 'Attestat',
    'id-doc': 'ID Document'
};


export const sendEmailWithFiles = async (req, res) => {
    try {
        const { userId, fullname, email, major } = req.body;
        const requiredFiles = ['uni-cert', 'photo-3x4', 'attestat', 'id-doc'];

        const user = await User.findById(userId).populate('files');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if( major === '') {
            return res.status(404).json({ message: 'Major is not selected.' });
        }

        const fileKeyMap = {};
        user.files.forEach(file => {
            const key = file.filename.split('.')[0]; // Extract key from filename (e.g., 'uni-cert')
            fileKeyMap[key] = file;
        });

        const missingFiles = requiredFiles.filter(key => !fileKeyMap[key]);

        if (missingFiles.length > 0) {
            return res.status(400).json({ message: `Missing required files: ${missingFiles.join(', ')}` });
        }

        const attachments = user.files.map(file => ({
            filename: file.filename,
            path: path.resolve(file.path.replace(/\\/g, '/'))
        }));


        const fileDetailsText = user.files.map(file => `${fileDisplayNames[file.filename.split('.')[0]]}: ${file.filename}`).join('\n');
        const emailText = `A new application has been submitted by ${fullname}.\nSelected major: ${major} \nAttached are the required files:\n\n${fileDetailsText}`;

        const mailOptions = {
            from: `"Uninroll" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'New Application',
            text: emailText,
            attachments: attachments
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error + ' ' + info);
                return res.status(500).json({message: 'Failed to send email', error: error.message});
            }
            try {
                const connection = await imaps.connect(imapConfig)
                await connection.openBox('Sent')

                const message = await simpleParser(mailOptions.text)
                await connection.append(message, { mailbox: 'Sent', flags: '\\Seen' })

                res.status(200).json({message: 'Application submitted successfully'});

            } catch (imapError) {
                console.log(imapError);
                res.status(500).json({message: 'Failed to send email', error: imapError.message});
            }

        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send application', error: error.message });
    }
};