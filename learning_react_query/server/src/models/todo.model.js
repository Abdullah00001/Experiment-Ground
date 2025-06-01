import { model, Schema } from "mongoose";

const TodoSchema = Schema({
  title: { type: String },
  date: { type: String },
  body: { type: String },
});

const Todo = model("Todo", TodoSchema);
export default Todo;
