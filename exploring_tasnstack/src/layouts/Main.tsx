import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Main: FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Main;
