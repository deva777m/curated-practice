import { Schema, model, Document,  } from 'mongoose';

// Define the User interface extending Mongoose Document
export interface IProblemsSaved extends Document {
    name: string,
    contestId: number,
    index: string,
    userId: string,
}

// Define the User schema
const userSchema = new Schema<IProblemsSaved>({
    name: { type: String, required: true },
    contestId: { type: Number, required: true },
    index: { type: String, required: true },
    userId: {type: String, required: true},
});

// Create and export the User model
export const ProblemsSaved = model<IProblemsSaved>('ProblemsSaved', userSchema);