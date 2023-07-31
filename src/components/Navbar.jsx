import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-yellow-400 py-4 px-8">
      <div className="text-white text-3xl font-bold">ClimaMate</div>
      <ul className="flex space-x-4">
        <li>
          <NavLink
            exact
            to="/"
            className="text-white font-semibold hover:text-black transition duration-200 ease-out text-lg"
            activeClassName="text-yellow-500"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className="text-white font-semibold hover:text-black transition duration-200 ease-out text-lg"
            activeClassName="text-yellow-500"
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className="text-white font-semibold hover:text-black transition duration-200 ease-out text-lg"
            activeClassName="text-yellow-500"
          >
            Favourites
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className="text-white font-semibold hover:text-black transition duration-200 ease-out text-lg"
            activeClassName="text-yellow-500"
          >
            Suggestions
          </NavLink>
        </li>
      </ul>
      <div className="justify-end">
      <NavLink
        to="/about"
        className="text-white font-semibold transition duration-200 ease-in-out text-lg"
        activeClassName="text-yellow-500"
      >
        <button className="border-2 border-white py-2 px-4 rounded-xl hover:text-yellow-400 hover:bg-white transition duration-200 ease-in-out">
          Sign in
        </button>
      </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
