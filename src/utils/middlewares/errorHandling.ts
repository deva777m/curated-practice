import {ErrorRequestHandler, Request, Response} from "express";
import errorHandler from "../ErrorHandler";

const errorHandling: ErrorRequestHandler = (err: Error, req: Request, res: Response) => {
    console.log('handling error....');
    const error = errorHandler(err);
    const errorCode = error.statusCode || 500;
    return res.status(errorCode).json({message: error.message});
}

export default errorHandling;