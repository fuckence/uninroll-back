const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const cors = require('cors');
const nodemailer = require('nodemailer');
const router = require('./routes/routes');

const PORT = 5000;
const HOST = 'localhost';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router)

app.get('/test-connection', (req, res) => {
   res.status(200).send('Backend is connected');
})

app.listen(PORT, () => console.log(`http://${HOST}:${PORT}`));