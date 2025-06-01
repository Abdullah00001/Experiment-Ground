import express from "express";
import cors from "cors";
import Todo from "./models/todo.model.js";
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/todo", async (req, res) => {
  const data = await Todo.find({});
  res.status(200).json({ success: true, data });
});

app.post("/todo", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save();
  res.status(200).json({ success: true, data: newTodo });
});

export default app;
