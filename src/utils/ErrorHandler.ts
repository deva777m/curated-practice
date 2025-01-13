import AppError from "./AppError";

const errorHandler = (error: Error | AppError) => {
    
    if (error instanceof AppError) {
        // log error
        if(!error.isOperational) {
            // handle non operational errors
            // close dependencies, etc
            // add critical error logging
            console.error("Critical error: ", error);
            process.exit(1);
        }
        return error;
    }

    // log error
    console.log(error);
    return new AppError("Internal server error", 500);
};

export default errorHandler;