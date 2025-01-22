import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ProblemsSaved } from './model';
import AppError from '../../utils/AppError';


// Define schema for the problemsSaved
const problemsSavedSchema = Joi.object({
    name: Joi.string().required(),
    index: Joi.string().required(),
    contestId: Joi.number().required(),
    userId: Joi.string().required(),
});

const problemSetHandlers = {
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get the user by id
            const savedProblems = await ProblemsSaved.find({ userId: req.body.userId });
            
            res.status(200).json(savedProblems);
        } catch (error) {
            next(error);
        }
    },

    post: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request body
            const { error, value } = problemsSavedSchema.validate(req.body);
            if (error) {
                throw new AppError(error.details[0].message, 400);
            }
            
            // Create a new user
            const newProblem = new ProblemsSaved({...value});
            await newProblem.save();

            res.status(201).json(newProblem);
        } catch (error) {
            next(error);
        }
    },
}

export default problemSetHandlers;