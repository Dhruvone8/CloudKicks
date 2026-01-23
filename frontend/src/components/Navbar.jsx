import React, { useEffect, useState, useContext } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import AuthDialog from "./ui/authDialog";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { setShowSearch, getCartCount, token, user, logout, isLoading } =
    useContext(ShopContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Check if auth dialog should be open based on URL
  const authDialogOpen = searchParams.get("auth") === "true";

  const setAuthDialogOpen = (open) => {
    if (open) {
      setSearchParams({ auth: "true" });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      if (token) {
        const count = await getCartCount();
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();

    const interval = setInterval(() => {
      if (token) {
        fetchCartCount();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [token, getCartCount]);

  const handleLogout = () => {
    logout();
    setVisible(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between py-5 font-medium">
        <img
          src={assets.logo}
          className="w-19 h-12 object-contain cursor-pointer"
          alt="CloudKicks Logo"
          onClick={() => (window.location.href = "/")}
        />
        <div className="flex items-center gap-6">
          <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between py-5 font-medium bg-white">
        <img
          src={assets.logo}
          className="w-19 h-12 object-contain cursor-pointer"
          alt="CloudKicks Logo"
          onClick={() => (window.location.href = "/")}
        />
        <ul className="hidden sm:flex gap-5 text-sm text-gray-800">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            {({ isActive }) => (
              <>
                <p>HOME</p>
                <hr className={`w-2/4 border-none h-[1.5px] bg-gray-800 ${isActive ? '' : 'hidden'}`} />
              </>
            )}
          </NavLink>
          <NavLink
            to="/collections"
            className="flex flex-col items-center gap-1"
          >
            {({ isActive }) => (
              <>
                <p>COLLECTIONS</p>
                <hr className={`w-2/4 border-none h-[1.5px] bg-gray-800 ${isActive ? '' : 'hidden'}`} />
              </>
            )}
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1">
            {({ isActive }) => (
              <>
                <p>ABOUT</p>
                <hr className={`w-2/4 border-none h-[1.5px] bg-gray-800 ${isActive ? '' : 'hidden'}`} />
              </>
            )}
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            {({ isActive }) => (
              <>
                <p>CONTACT</p>
                <hr className={`w-2/4 border-none h-[1.5px] bg-gray-800 ${isActive ? '' : 'hidden'}`} />
              </>
            )}
          </NavLink>
        </ul>

        <div className="flex items-center gap-4 sm:gap-6">
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="Search"
          />

          <div className="group relative hidden sm:block">
            <img
              src={assets.profile_icon}
              className="w-5 cursor-pointer"
              alt="Profile"
            />
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-white border border-gray-300 text-gray-800 rounded shadow-lg">
                {token && user ? (
                  <>
                    <p className="text-xs text-gray-900 font-medium border-b border-gray-300 pb-2">
                      Welcome,{" "}
                      {user.name || user.email?.split("@")[0] || "User"}
                    </p>
                    <Link
                      to="/orders"
                      className="cursor-pointer hover:text-black"
                    >
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

          <img
            src={assets.profile_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="Profile"
            onClick={() => {
              if (token && user) {
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
            {cartCount > 0 && (
              <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                {cartCount}
              </p>
            )}
          </Link>
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt=""
            className="w-5 cursor-pointer sm:hidden"
          />
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-50 ${
            visible ? "w-full" : "w-0"
          }`}
        >
          <div className="flex flex-col text-gray-800 h-full">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center justify-between p-5 border-b border-gray-200"
            >
              <img
                src={assets.logo}
                className="w-16 h-10 object-contain"
                alt="CloudKicks Logo"
              />
              <img className="h-5" src={assets.cross_icon} alt="Close" />
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="py-4">
                <NavLink
                  onClick={() => setVisible(false)}
                  className={({ isActive }) => 
                    `flex items-center justify-between py-4 px-6 text-base hover:bg-gray-50 transition-colors ${
                      isActive ? 'font-semibold text-gray-900' : 'text-gray-800'
                    }`
                  }
                  to="/"
                >
                  <span>HOME</span>
                  <span className="text-gray-400">›</span>
                </NavLink>
                <NavLink
                  onClick={() => setVisible(false)}
                  className={({ isActive }) => 
                    `flex items-center justify-between py-4 px-6 text-base hover:bg-gray-50 transition-colors ${
                      isActive ? 'font-semibold text-gray-900' : 'text-gray-800'
                    }`
                  }
                  to="/collections"
                >
                  <span>COLLECTIONS</span>
                  <span className="text-gray-400">›</span>
                </NavLink>
                <NavLink
                  onClick={() => setVisible(false)}
                  className={({ isActive }) => 
                    `flex items-center justify-between py-4 px-6 text-base hover:bg-gray-50 transition-colors ${
                      isActive ? 'font-semibold text-gray-900' : 'text-gray-800'
                    }`
                  }
                  to="/about"
                >
                  <span>ABOUT</span>
                  <span className="text-gray-400">›</span>
                </NavLink>
                <NavLink
                  onClick={() => setVisible(false)}
                  className={({ isActive }) => 
                    `flex items-center justify-between py-4 px-6 text-base hover:bg-gray-50 transition-colors ${
                      isActive ? 'font-semibold text-gray-900' : 'text-gray-800'
                    }`
                  }
                  to="/contact"
                >
                  <span>CONTACT</span>
                  <span className="text-gray-400">›</span>
                </NavLink>

                {token && user && (
                  <NavLink
                    onClick={() => setVisible(false)}
                    className={({ isActive }) => 
                      `flex items-center justify-between py-4 px-6 text-base hover:bg-gray-50 transition-colors ${
                        isActive ? 'font-semibold text-gray-900' : 'text-gray-800'
                      }`
                    }
                    to="/orders"
                  >
                    <span>MY ORDERS</span>
                    <span className="text-gray-400">›</span>
                  </NavLink>
                )}
              </nav>

              <div className="border-t border-gray-200 mt-4">
                {token && user ? (
                  <div className="py-6 px-6">
                    <p className="text-sm text-gray-500 mb-4">
                      Hello, {user.name || user.email?.split("@")[0] || "User"}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-black text-white py-3 px-6 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      LOGOUT
                    </button>
                  </div>
                ) : (
                  <div className="py-6 px-6 space-y-3">
                    <p className="text-sm text-gray-700 mb-4">
                      Become a Member for the best products, inspiration and stories in sport.{" "}
                      <span className="underline cursor-pointer">Learn more</span>
                    </p>
                    <button
                      onClick={() => {
                        setVisible(false);
                        setAuthDialogOpen(true);
                      }}
                      className="w-full bg-black text-white py-3 px-6 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      JOIN US
                    </button>
                    <button
                      onClick={() => {
                        setVisible(false);
                        setAuthDialogOpen(true);
                      }}
                      className="w-full border border-gray-300 text-gray-800 py-3 px-6 rounded-full text-sm font-medium hover:border-gray-400 transition-colors"
                    >
                      SIGN IN
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};

export default Navbar;