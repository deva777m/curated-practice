import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import config from './config';

export const jwtAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json("Token is required");
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret!);
        req.body.user = decoded;
        next();
    } catch (error) {
        console.error("Error decoding the token: ", error);
        res.status(500).send("Error decoding the token");
    }
};