import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Database Connected");
  } catch (error) {
    console.error("Database Connection Failed");
  }
};

export default connectDatabase;
