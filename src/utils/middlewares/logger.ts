import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const requestDetails = {   
        method: req.method,
        url: req.url,
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
    };
    logger.info('Request', requestDetails);
    next();
};