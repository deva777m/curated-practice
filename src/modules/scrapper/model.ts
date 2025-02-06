import { Schema, model, Document,  } from 'mongoose';

// Define the User interface extending Mongoose Document
export interface IRatedUser extends Document {
    handle: string,
    rating: number,
    platform: string,
}

// Define the User schema
const ratedUserSchema = new Schema<IRatedUser>({
    handle: { type: String, required: true },
    rating: { type: Number, required: true },
    platform: { type: String, required: true },
});

// Create and export the User model
export const RatedUser = model<IRatedUser>('RatedUser', ratedUserSchema);