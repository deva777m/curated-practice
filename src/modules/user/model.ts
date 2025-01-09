import { Schema, model, Document } from 'mongoose';

// Define the User interface extending Mongoose Document
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

// Define the User schema
const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Create and export the User model
export const User = model<IUser>('User', userSchema);