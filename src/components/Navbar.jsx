import { useState } from "react";
import { close, logo, menu } from "../assets";
import { navLinks } from "../constants";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <img src={logo} alt="hoobank" className="w-[124px] h-[32px]" />

      {/* Desktop Navigation */}
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`group font-poppins cursor-pointer text-[16px] ${
              active === nav.title ? "text-secondary font-semibold" : "text-dimWhite font-regular"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`#${nav.id}`}>{nav.title}</a>
            <div className="h-0.5 bg-secondary scale-x-0 group-hover:scale-100 transition-transform origin-left rounded-full duration-300 ease-out" />
          </li>
        ))}
        {/* Sign In and Sign Up buttons with underline animation */}
       <li className="ml-10 group">
  <Link to="/SignIn" className="text-dimWhite text-[16px]">Sign In</Link>
  <div className="h-0.5 bg-secondary scale-x-0 group-hover:scale-100 font-bold transition-transform origin-left rounded-full duration-300 ease-out" />
</li>

        <li className="ml-6 group">
          <a href="#signup" className="text-white bg-gray-900 px-4 py-2 rounded-lg text-[16px] hover:bg-secondary-dark">Sign Up</a>
          <div className="h-0.5 scale-x-0 group-hover:scale-100 transition-transform origin-left rounded-full duration-300 ease-out" />
        </li>
      </ul>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${!toggle ? "hidden" : "flex"} p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
            {/* Sign In and Sign Up buttons for mobile */}
            <li className="mt-4 group">
              <Link to="/SignIn" className="text-dimWhite text-[16px]">Sign In</Link>
              <div className="h-0.5 bg-secondary scale-x-0 group-hover:scale-100 font-bold transition-transform origin-left rounded-full duration-300 ease-out" />
            </li>
            <li className="mt-4 group">
              <a
                href="#signup"
                className="text-white bg-secondary px-4 py-2 rounded-lg text-[16px] hover:bg-secondary-dark"
              >
                Sign Up
              </a>
              <div className="h-0.5 bg-secondary scale-x-0 group-hover:scale-100 transition-transform origin-left rounded-full duration-300 ease-out" />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
