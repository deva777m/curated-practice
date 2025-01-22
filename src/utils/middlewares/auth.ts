import jwt, { JwtPayload } from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import config from '../../config/config';
import AppError from '../AppError';

export const jwtAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json("Token is required");
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret!);
        const user = decoded as JwtPayload;
        if(user && user.id) {
            req.body.userId = user.id;
        } else {
            throw new AppError('User Not Found', 401);
        }
        next();
    } catch (error) {
        next(error);
    }
};