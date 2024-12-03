import { useState } from "react";
import { close, logo, menu } from "../assets";
import { navLinks } from "../constants";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <img src={logo} alt="qila" className="w-[124px] h-[32px]" />

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
          <Link to="/signin" className="text-dimWhite text-[16px]">Sign In</Link>
          <div className="h-0.5 bg-secondary scale-x-0 group-hover:scale-100 font-bold transition-transform origin-left rounded-full duration-300 ease-out" />
        </li>

        <li className="ml-6 group">
          <Link to="/signup" className="text-white bg-gray-900 px-4 py-2 rounded-lg text-[16px] hover:bg-secondary-dark">Sign Up</Link>
          <div className="h-0.5 scale-x-0 group-hover:scale-100 transition-transform origin-left rounded-full duration-300 ease-out" />
        </li>
      </ul>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain cursor-pointer z-[100]"
          onClick={() => setToggle(!toggle)}
        />

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-[70%] bg-gradient-to-b from-black to-blue-800 z-[100] p-6 
          ${toggle ? 'translate-x-0' : 'translate-x-full'} transition-all duration-300 ease-in-out`}
        >
          <ul className="list-none flex flex-col mt-14">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] 
                ${active === nav.title ? "text-white" : "text-dimWhite"}
                ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => {
                  setActive(nav.title);
                  setToggle(false);
                }}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
            <li className="mt-4">
              <Link 
                to="/signin" 
                className="text-dimWhite text-[16px] block"
                onClick={() => setToggle(false)}
              >
                Sign In
              </Link>
            </li>
            <li className="mt-4">
              <Link 
                to="/signup" 
                className="text-white bg-blue-600 px-4 py-2 rounded-lg text-[16px] inline-block hover:bg-blue-700"
                onClick={() => setToggle(false)}
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>

        {/* Overlay */}
        {toggle && (
          <div 
            className="fixed inset-0 bg-black/50 z-[98]"
            onClick={() => setToggle(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
