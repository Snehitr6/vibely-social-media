
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  MessageCircle,
  Menu,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/explore?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-[60] w-full border-b border-white/10 bg-[#0e1017]/95 backdrop-blur-xl lg:left-[270px] lg:w-[calc(100%-270px)]">
      <div className="flex h-[72px] w-full items-center gap-3 px-3 sm:px-6">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white">
            V
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Vibely
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="mx-auto hidden w-full max-w-md md:block"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Vibely..."
              className="w-full rounded-full border border-white/10 bg-[#191c27] py-2.5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-purple-500"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <Link
            to="/messages"
            className="hidden rounded-full p-2.5 text-gray-400 transition hover:bg-white/10 hover:text-white sm:block"
            aria-label="Messages"
          >
            <MessageCircle size={21} />
          </Link>

          <Link
            to="/notifications"
            className="rounded-full p-2.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={21} />
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="flex items-center gap-2 rounded-full p-1 transition hover:bg-white/10"
            >
              <img
                src={user?.avatar || "https://i.pravatar.cc/100"}
                alt="Profile"
                className="h-9 w-9 rounded-full border border-white/10 object-cover"
              />
              <span className="hidden max-w-28 truncate text-sm font-medium text-white lg:block">
                {user?.name || "My Account"}
              </span>
            </button>

            {showMenu && (
              <>
                <button
                  aria-label="Close account menu"
                  onClick={() => setShowMenu(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />

                <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-white/10 bg-[#191c27] p-2 shadow-2xl">
                  <Link
                    to="/profile"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 hover:bg-white/10"
                  >
                    <User size={17} />
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 hover:bg-white/10"
                  >
                    <LogOut size={17} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Vibely..."
            className="w-full rounded-full border border-white/10 bg-[#191c27] py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-500"
          />
        </div>
      </form>
    </header>
  );
}
