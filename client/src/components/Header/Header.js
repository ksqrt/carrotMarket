import { useContext, useState, useEffect, useRef } from 'react';
import { Context } from '../../ContextStore';
import { NavLink } from 'react-router-dom';
import { BsFillPersonFill, BsFillEnvelopeFill, BsFillPlusCircleFill } from 'react-icons/bs';
import { IoLogOut } from 'react-icons/io5';

function Header() {
  const { userData, setUserData } = useContext(Context);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <NavLink className="text-xl font-semibold" to="/">
            All for you...
          </NavLink>
          {userData ? (
            <div className="relative">
              <button className="flex items-center justify-center w-8 h-8 overflow-hidden rounded-full" onClick={toggleDropdown}>
                <img
                  className="w-full h-full object-cover"
                  src={userData.avatar}
                  alt="user-avatar"
                />
              </button>
              {showDropdown && (
                <ul ref={dropdownRef} className="absolute right-0 mt-2 py-2 bg-white shadow-lg rounded-md z-50">
                  <li>
                    <NavLink
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      to="/add-product"
                      onClick={toggleDropdown}
                    >
                      <BsFillPlusCircleFill className="mr-2" />
                      Add a sell.
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      to={`/profile/${userData._id}`}
                      onClick={toggleDropdown}
                    >
                      <BsFillPersonFill className="mr-2" />
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      to="/messages"
                      onClick={toggleDropdown}
                    >
                      <BsFillEnvelopeFill className="mr-2" />
                      Messages
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      to="/auth/logout"
                      onClick={() => {
                        setUserData(null);
                      }}
                    >
                      <IoLogOut className="mr-2" />
                      Log out
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="flex">
              <NavLink
                className="mr-2 px-4 py-2 text-gray-800 border border-gray-800 rounded hover:bg-gray-800 hover:text-white"
                to="/auth/login"
              >
                Sign In
              </NavLink>
              <NavLink
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                to="/auth/register"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
