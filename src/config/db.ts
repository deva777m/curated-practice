import mongoose from "mongoose";
import config from "./config";
import logger from "./logger";

// Define the database connection
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.database}`);
        console.log("Connected to the database");
    } catch (error) {
        logger.error("Error connecting to the database: ", error);
        process.exit(1);
    }
};

export default connectDB;