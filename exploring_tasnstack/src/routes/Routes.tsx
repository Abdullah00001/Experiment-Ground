import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Posts from "../pages/Posts";
import Main from "../layouts/Main";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/posts",
        element: <Posts />,
      },
    ],
  },
]);

export default Routes;
