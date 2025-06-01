import apiClient from "../configs/axios.config";

const todoApis = {
  getAllTodos: () => {
    return apiClient.get("/todo");
  },
  createTodo: (payload) => {
    return apiClient.post("/todo", payload);
  },
};

export default todoApis;
