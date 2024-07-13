import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();
import userRouter from './routes/userRoute.js'
import fileRouter from './routes/fileRoute.js'
import emailRouter from './routes/emailRoute.js'
import applicationRouter from './routes/applicationRoute.js'
import path from "path"
import { fileURLToPath } from 'url'

// Constants
const PORT = process.env.PORT;
const HOST = 'localhost';
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const app = express();

const uploadsDir = path.resolve(fileURLToPath(import.meta.url), '../uploads');

app.use(cors({
   origin: 'https://uninroll.com'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/email', emailRouter)
app.use('/api/auth', userRouter)
app.use('/api/file', fileRouter)
app.use('/api/application', applicationRouter)



app.get('/test', (req, res) => {
   res.status(200).send('Backend is connected');
})


async function start() {
   try {
      console.log(DB_USER, DB_PASSWORD, DB_NAME);
      await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.gcl213u.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`)
      app.listen(PORT, () => console.log(`http://${HOST}:${PORT}`));
   } catch (e) {
      console.error(e);
   }
}

start()