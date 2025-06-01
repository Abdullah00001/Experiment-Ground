import { FC } from "react";
import { Link } from "react-router-dom";

const Header: FC = () => {
  return (
    <>
      <ul className="flex gap-5 justify-center py-4 bg-slate-400">
        <li className="text-xl font-bold">
          <Link to={"/"}>Home</Link>
        </li>
        <li className="text-xl font-bold">
          <Link to={"/posts"}> Posts </Link>
        </li>
      </ul>
    </>
  );
};

export default Header;
