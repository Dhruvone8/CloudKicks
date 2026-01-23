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

  const authDialogOpen = searchParams.get("auth") === "true";

  const setAuthDialogOpen = (open) => {
    if (open) setSearchParams({ auth: "true" });
    else setSearchParams({});
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
      if (token) fetchCartCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [token, getCartCount]);

  const handleLogout = () => {
    logout();
    setVisible(false);
  };

  if (isLoading) {
    return (
      <div className="relative z-50 flex items-center justify-between py-5 font-medium bg-white">
        <img
          src={assets.logo}
          className="w-19 h-12 object-contain cursor-pointer"
          alt="CloudKicks Logo"
          onClick={() => (window.location.href = "/")}
        />
        <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full" />
      </div>
    );
  }

  return (
    <>
      {/* ✅ Z-INDEX FIXED NAVBAR */}
      <div className="relative z-50 flex items-center justify-between py-5 font-medium bg-white">
        <img
          src={assets.logo}
          className="w-19 h-12 object-contain cursor-pointer"
          alt="CloudKicks Logo"
          onClick={() => navigate("/")}
        />

        {/* DESKTOP LINKS */}
        <ul className="hidden sm:flex gap-5 text-sm text-gray-800">
          {["/", "/collections", "/about", "/contact"].map((path, i) => (
            <NavLink key={i} to={path} className="flex flex-col items-center gap-1">
              {({ isActive }) => (
                <>
                  <p>
                    {path === "/"
                      ? "HOME"
                      : path.replace("/", "").toUpperCase()}
                  </p>
                  <hr
                    className={`w-2/4 h-[1.5px] bg-gray-800 border-none ${
                      isActive ? "" : "hidden"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </ul>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="Search"
            onClick={() => setShowSearch(true)}
          />

          {/* PROFILE DROPDOWN */}
          <div className="group relative hidden sm:block">
            <img
              src={assets.profile_icon}
              className="w-5 cursor-pointer"
              alt="Profile"
            />
            <div className="group-hover:block hidden absolute right-0 pt-4 z-50">
              <div className="w-36 py-3 px-5 bg-white border rounded shadow">
                {token ? (
                  <>
                    <p className="text-xs border-b pb-2 mb-2">
                      Welcome, {user?.name || "User"}
                    </p>
                    <Link to="/orders">My Orders</Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="text-red-600 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button onClick={() => setAuthDialogOpen(true)}>
                    Login / Register
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CART */}
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5" alt="Cart" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -bottom-1 w-4 h-4 bg-black text-white text-[8px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* ✅ ADMIN PANEL BUTTON (CLICKABLE NOW) */}
          <a
            href={import.meta.env.VITE_ADMIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block z-50 bg-black text-white px-4 py-2 rounded-md text-xs font-medium hover:scale-105 transition-all"
          >
            Admin Panel
          </a>

          {/* MOBILE MENU ICON */}
          <img
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="Menu"
            onClick={() => setVisible(true)}
          />
        </div>
      </div>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};

export default Navbar;
