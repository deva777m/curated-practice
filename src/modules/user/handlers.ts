import { Request, Response } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from './model';
import config from './config';


// Define schema for the user
const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(10).required(),
});

// Define schema for login validation
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const userHandlers = {
    get: async (req: Request, res: Response) => {
        const id = req.body.user.id;
        try {
            if(!id) { 
                return res.status(400).send("Name is required");
            }
            // Get the user by id
            const user = await User.findOne({ _id: id });
            
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
            // Hash the password
            const hashedPassword = await bcrypt.hash(value.password, 10);
            
            // Create a new user
            const newUser = new User({...value, password: hashedPassword});
            await newUser.save();

            // remove password from the response
            newUser.password = '';
            res.status(201).json(newUser);
        } catch (error) {
            console.error("Error saving the user: ", error);
            res.status(500).send("Error saving the user");
        }
    },

    login: async (req: Request, res: Response) => {
        // Validate the request body against the login schema
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password } = value;
        try {
            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Invalid email' });
            }

            // Compare the hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Generate an access token
            if (!config.jwt.secret) {
                throw new Error("JWT secret is not defined");
            }

            const token = jwt.sign({ id: user.id, email: user.email }, config.jwt.secret, { expiresIn: '1h' });
            res.status(200).json({ token });
        } catch (error) {
            console.error("Error logging in: ", error);
            res.status(500).send("Error logging in");
        }
    }

}

export default userHandlers;