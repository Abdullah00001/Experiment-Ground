import { RouterProvider } from "react-router-dom";
import "./App.css";
import { FC } from "react";
import Routes from "./routes/Routes";

const App: FC = () => {
  return (
    <>
      <RouterProvider router={Routes}></RouterProvider>
    </>
  );
};

export default App;
