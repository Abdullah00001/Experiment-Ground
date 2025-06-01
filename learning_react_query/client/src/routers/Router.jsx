import { createBrowserRouter } from "react-router-dom";
import Todos from "../pages/Todos";
import CreateTodo from "../pages/CreateTodos";
import Main from "../layouts/Main";
import Home from "../pages/Home";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/todo",
        element: <Todos />,
      },
      {
        path: "/create-todo",
        element: <CreateTodo />,
      },
    ],
  },
]);

export default Router;
