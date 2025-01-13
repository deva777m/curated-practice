import express from 'express';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

const app = express();

// load environment variables
dotenv.config({path: 'src/.env'});

// import user module
import userModule from './modules/user';
import errorHandling from './utils/middlewares/errorHandling';
import errorHandler from './utils/ErrorHandler';
import AppError from './utils/AppError';

// connect to database
userModule.connectDB();

app.use(express.json());

// routes
app.use('/user', userModule.router);

app.get('/', (req, res) => {
    console.log(req.headers);
    res.send('Hello World!');
});

// handle errors and responds with json
app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction) => {errorHandling(err, req, res, next)});

// unhandled exception
process.on('unhandledRejection', (error: Error) => {
    const apperror = new AppError(error.message, 500, false);
    errorHandler(apperror);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});