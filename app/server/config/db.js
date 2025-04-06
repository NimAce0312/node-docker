import mongoose from "mongoose";
import { DB_URI } from "./env.js";

if (!DB_URI) throw new Error("MongoDB URI doesn't exist.");

const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(DB_URI);
    const dbName = connection.connection.db.databaseName;
    console.log(`Connected to database: ${dbName}`);
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
};

export default connectToDB;
