import todoApis from "../apis/todo.apis";

const todoServices = {
  getAllTodoService: async () => {
    try {
      return await todoApis.getAllTodos();
    } catch (error) {
      throw error;
    }
  },
  createTodoService: async (payload) => {
    try {
      return todoApis.createTodo(payload);
    } catch (error) {
      throw error;
    }
  },
};

export default todoServices;
