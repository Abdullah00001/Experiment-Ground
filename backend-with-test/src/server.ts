import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
  });
})();
