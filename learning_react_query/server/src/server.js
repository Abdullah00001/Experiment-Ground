import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const dbUri = process.env.MONGODB_URI;
const PORT = process.env.PORT;

(async () => {
  await mongoose.connect(dbUri);
  app.listen(PORT, () => {
    console.log("server connected");
  });
})();
