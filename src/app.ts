import express from 'express';
import dotenv from 'dotenv';

const app = express();

// load environment variables
dotenv.config({path: 'src/.env'});

// import user module
import userModule from './modules/user';

// connect to database
userModule.connectDB();

app.use(express.json());

// routes
app.use('/user', userModule.router);

app.get('/', (req, res) => {
    console.log(req.headers);
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});