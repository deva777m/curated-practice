import express from 'express';
import dotenv from 'dotenv';

const app = express();

app.use(express.json());

// load environment variables
dotenv.config({path: 'src/.env'});

// connect to database
import connectDB from './config/db';
connectDB();

// import user module
import userModule from './modules/user';
import problemsetModule from './modules/problemset';
import scrapperModule from './modules/scrapper';
import errorHandling from './utils/middlewares/errorHandling';
import errorHandler from './utils/ErrorHandler';
import AppError from './utils/AppError';
import {loggerMiddleware} from './utils/middlewares/logger';

//middlewares
app.use(loggerMiddleware);

// routes
app.use('/user', userModule.router);
app.use('/problemset', problemsetModule.router);
app.use('/scrapper', scrapperModule.router);

app.get('/', (req, res) => {
    console.log(req.headers);
    res.send('Hello World!');
});

// handle errors and responds with json
app.use(errorHandling);

// unhandled exception
process.on('unhandledRejection', (error: Error) => {
    const apperror = new AppError(error.message, 500, false);
    errorHandler(apperror);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});