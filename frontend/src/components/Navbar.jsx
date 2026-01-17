import React from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link, NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import AuthDialog from "./ui/authDialog";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { setShowSearch, getCartCount, token, user, logout } = useContext(ShopContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="flex items-center justify-between py-5 font-medium">
        <img
          src={assets.logo}
          className="w-19 h-12 object-contain cursor-pointer"
          alt="CloudKicks Logo"
          onClick={() => (window.location.href = "/")}
        />
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/collections" className="flex flex-col items-center gap-1">
            <p>COLLECTIONS</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p>ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p>CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>

        <div className="flex items-center gap-6">
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="Search"
          />
          
          {/* Desktop Profile Dropdown */}
          <div className="group relative hidden sm:block">
            <img
              src={assets.profile_icon}
              className="w-5 cursor-pointer"
              alt="Profile"
            />
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
                {token ? (
                  <>
                    {user && (
                      <p className="text-xs text-gray-700 font-medium border-b pb-2">
                        Hello, {user.email?.split('@')[0] || 'User'}
                      </p>
                    )}
                    <Link to="/orders" className="cursor-pointer hover:text-black">
                      My Orders
                    </Link>
                    <hr className="border-gray-300" />
                    <button
                      onClick={handleLogout}
                      className="text-left cursor-pointer hover:text-black font-medium text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setAuthDialogOpen(true)}
                    className="text-left cursor-pointer hover:text-black font-medium"
                  >
                    Login/Register
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Profile Icon - Opens Dialog */}
          <img
            src={assets.profile_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="Profile"
            onClick={() => {
              if (token) {
                // Show a mobile menu or navigate to profile
                setVisible(true);
              } else {
                setAuthDialogOpen(true);
              }
            }}
          />

          <Link to="/cart" className="relative">
            <img
              src={assets.cart_icon}
              className="w-5 min-w-5 cursor-pointer"
              alt="Cart"
            />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount() || 0}
            </p>
          </Link>
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt=""
            className="w-5 cursor-pointer sm:hidden"
          />
        </div>

        {/* Sidebar Menu for small screens*/}
        <div
          className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-50 ${
            visible ? "w-full" : "w-0"
          }`}
        >
          <div className="flex flex-col text-gray-600">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-4 p-3 ml-auto cursor-pointer"
            >
              <img className="h-4 rotate-180" src={assets.cross_icon} alt="" />
            </div>

            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/"
            >
              HOME
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/collections"
            >
              COLLECTIONS
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/about"
            >
              ABOUT
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/contact"
            >
              CONTACT
            </NavLink>

            {/* Mobile Auth Section */}
            {token ? (
              <>
                <NavLink
                  onClick={() => setVisible(false)}
                  className="py-2 pl-6 border"
                  to="/orders"
                >
                  MY ORDERS
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setVisible(false);
                  }}
                  className="py-2 pl-6 border text-left text-red-600 font-medium"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setVisible(false);
                  setAuthDialogOpen(true);
                }}
                className="py-2 pl-6 border text-left font-medium"
              >
                LOGIN/REGISTER
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};

export default Navbar;