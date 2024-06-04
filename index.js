const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const cors = require('cors');
const nodemailer = require('nodemailer');
const router = require('./routes/routes');


// const transporter = nodemailer.createTransport({
//    service: 'gmail',
//    host: "smtp.ethereal.email",
//    port: 587,
//    secure: false,
//    auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_PASS,
//    }
// });

const PORT = 5000;
const HOST = 'localhost';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router)
// function getFormattedDate() {
//    const date = new Date();
//    const year = date.getFullYear();
//    const month = ('0' + (date.getMonth() + 1)).slice(-2); // add leading zero
//    const day = ('0' + date.getDate()).slice(-2); // add leading zero
//    return `${year}-${month}-${day}`;
// }
//
// function formatFullname(fullname) {
//    return fullname.split('_').map(word =>
//        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//    ).join(' ');
// }
//
// const storage = multer.diskStorage({
//    destination: (req, file, cb) => {
//       const fullName = req.body.fullname.replace(/ /g, '_'); // Replace spaces with underscores
//       const currentDate = getFormattedDate();
//       const dir = `./uploads/${fullName}_${currentDate}`;
//
//       // Create directory if it does not exist
//       if (!fs.existsSync(dir)){
//          fs.mkdirSync(dir, { recursive: true });
//       }
//
//       cb(null, dir);
//    },
//    filename: (req, file, cb) => {
//       // Use the original file name
//       cb(null, file.originalname);
//    }
// });
//
// const upload = multer({ storage: storage });


// Setup route
// app.post('/upload-multiple', upload.fields([
//    { name: 'unt-cert' },
//    { name: 'photo-3x4' },
//    { name: 'id-doc' },
//    { name: 'attestat' }
// ]), async (req, res) => {
//    console.log('Files and fullname received:', req.body.fullname);
//    const files = req.files;
//    const fullName = formatFullname(req.body.fullname.replace(/ /g, '_'));
//    const currentDate = getFormattedDate();
//    const dir = `./uploads/${fullName}_${currentDate}`;
//    let fileDetails = '';
//    for (const fileKey in req.files) {
//       req.files[fileKey].forEach(file => {
//          fileDetails += `${file.fieldname}: ${file.originalname}\n`;
//       });
//    }
//
//    const attachments = Object.keys(files).reduce((acc, key) => {
//       return acc.concat(files[key].map(file => ({
//          filename: file.originalname,
//          path: file.path
//       })));
//    }, []);
//
//    const mailOptions = {
//       from: 'sancho.serik2003s.s@gmail.com',
//       to: 'yucanmor@gmail.com',
//       subject: 'University Application Student',
//       text: `Fullname: ${fullName}\nFile details:\n${fileDetails}.`,
//       attachments
//    };
//
//    try {
//       const info = await transporter.sendMail(mailOptions);
//       console.log('Email sent:', info.response);
//       res.send('Files uploaded and email sent successfully');
//    } catch (error) {
//       console.error('Error sending email:', error);
//       res.status(500).send('Failed to send email');
//    }
// });

app.get('/test-connection', (req, res) => {
   res.status(200).send('Backend is connected');
});
//
// // Endpoint to handle file download
// app.get('/download/:filename', (req, res) => {
//    const filePath = path.join(__dirname, 'uploads', req.params.filename);
//    if (fs.existsSync(filePath)) {
//       res.download(filePath);
//    } else {
//       res.status(404).send('File not found.');
//    }
// });

app.listen(PORT, () => console.log(`http://${HOST}:${PORT}`));