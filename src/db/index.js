import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if(!uri){
      throw new Error("MONGODB_URI: is not defined")
      
    }
    console.log("FINAL URI =", process.env.MONGO_URI);
     const connectionInstance = await mongoose.connect(uri);
     console.log(`\n MongoDB connected !! DB host ${connectionInstance.connection.host}`);
     

  } catch(error) {
    console.log("MONGO DB connection error", error);
    process.exit(1);
    
  }
}

export default connectDB;