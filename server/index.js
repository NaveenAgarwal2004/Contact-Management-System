import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './Routes/contactRoute.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactRoutes);
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`)))
    .catch(err => console.log(err))