import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <nav className="bg-blue-500 p-4 shadow-md">
      <ul className="flex space-x-6 justify-center text-white text-lg">
        <li>
          <NavLink to="/" className="hover:underline">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/todo" className="hover:underline">
            Todos
          </NavLink>
        </li>
        <li>
          <NavLink to="/create-todo" className="hover:underline">
            Create-Todos
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
