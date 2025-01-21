import AppError from "./AppError";
import logger from "../config/logger";

const errorHandler = (error: Error | AppError) => {
    
    if (error instanceof AppError) {
        // log error
        if(!error.isOperational) {
            // handle non operational errors
            // close dependencies, etc
            // add critical error logging
            logger.error("Critical error", error);
            process.exit(1);
        }
        logger.error('AppError', error);
        return error;
    }

    // log error
    logger.error('Error', error);
    return new AppError("Internal server error", 500);
};

export default errorHandler;