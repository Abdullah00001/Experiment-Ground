import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./configs/db.configs.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server Running On Port ${PORT}`);
    });
  } catch (error) {
    console.log(`Server Connection Failed`);
    console.error(`Error Message: ${error.message}`);
  }
})();
