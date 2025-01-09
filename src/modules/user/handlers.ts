import { Request, Response } from 'express';
import Joi from 'joi';
import { User } from './model';


// Define schema for the user
const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(10).required(),
});

const userHandlers = {
    get: async (req: Request, res: Response) => {
        const name = req.query.name;
        try {
            if(!name) { 
                return res.status(400).send("Name is required");
            }
            // Get the user
            const user = await User.findOne({ name });
            res.status(200).json(user);
        } catch (error) {
            console.error("Error getting the user: ", error);
            res.status(500).send("Error getting the user");
        }
    },

    post: async (req: Request, res: Response) => {
        // Validate the request body
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json(error);
        }

        try {
            // Create a new user
            const newUser = new User(value);
            await newUser.save();
            res.status(201).json(newUser);
        } catch (error) {
            console.error("Error saving the user: ", error);
            res.status(500).send("Error saving the user");
        }
    },
}

export default userHandlers;