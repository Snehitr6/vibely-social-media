
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  Bell,
  MessageCircle,
  User,
  PlusSquare,
  LogOut,
  X,
  Clapperboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen = false, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Explore", path: "/explore", icon: Compass },
    { label: "Reels", path: "/reels", icon: Clapperboard },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Messages", path: "/messages", icon: MessageCircle },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose?.();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-[70] flex h-screen w-[270px] flex-col border-r border-white/10 bg-[#141620] px-5 py-6 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white">
              V
            </div>

            <span className="text-2xl font-bold tracking-tight text-white">
              Vibely
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-purple-600/15 text-purple-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={21} />
              {label}
            </NavLink>
          ))}

          <button
            onClick={() => {
              navigate("/?create=true");
              onClose?.();
            }}
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <PlusSquare size={21} />
            Create Post
          </button>
        </nav>

        <div className="border-t border-white/10 pt-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={20} />
            Sign Out
          </button>

          <p className="mt-5 text-center text-xs text-gray-600">
            © 2026 Vibely
          </p>
        </div>
      </aside>
    </>
  );
}
