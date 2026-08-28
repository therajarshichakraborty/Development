import mongoose from "mongoose";
import { env } from "./env.config.js";

const connectToDatabase = async (): Promise<void> => {
    try {
        const databaseURI = env.DATABASE_URL;
        if (!databaseURI) {
            throw new Error("DATABASE_URL is not defined");
        }
        await mongoose.connect(databaseURI!);
        console.log("Connected to database successfully!");
    } catch (error) {
        console.error("Error connecting to database", error);
        throw error;
    }
}

export default connectToDatabase