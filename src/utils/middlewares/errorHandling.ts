import {NextFunction, Request, Response} from "express";
import errorHandler from "../ErrorHandler";
import logger from "../../config/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandling = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.info('handling error....');
    const error = errorHandler(err);
    const errorCode = error.statusCode || 500;
    return res.status(errorCode).json({message: error.message});
}

export default errorHandling;