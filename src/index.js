import cors from 'cors';
import dotenv from 'dotenv';
import express, { json } from 'express';
import router from './routers/index.js';

dotenv.config();

const app = express();

app.use(json());
app.use(cors());

app.use(router);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port ${port}`));
