import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors("*"));

import Topics from "./routes/topics.routes.js";
import Preference from "./routes/preference.routes.js";

app.use("/api/v1/", Topics);
app.use("/api/v1/", Preference);

export default app;
