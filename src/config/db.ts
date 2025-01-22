import mongoose from "mongoose";
import config from "./config";

// Define the database connection
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.database}`);
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database: ", error);
        process.exit(1);
    }
};

export default connectDB;