import mongoose from "mongoose";
import { env } from "./env.config.js";
import { DB_NAME } from "./constant.config.js";

const connectToDatabase = async (): Promise<void> => {
  try {
    const databaseURI = env.DATABASE_URL;
    if (!databaseURI) {
      throw new Error("DATABASE_URL is not defined");
    }
    const connectionInstance = await mongoose.connect(`${databaseURI}/${DB_NAME}`!);
    console.log(`\n MongoDB connected successfullt!! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
    // throw error;
  }
};

export default connectToDatabase;
