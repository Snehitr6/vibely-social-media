
import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocialProvider } from "./context/SocialContext";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";
import CreatePost from "./components/CreatePost";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Reels from "./pages/Reels";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";

import {
  Home as HomeIcon,
  Compass,
  Clapperboard,
  Bell,
  MessageCircle,
  UserRound,
  X,
} from "lucide-react";

function ProtectedLayout() {
  const { user } = useAuth();
  const location = useLocation();

  const [createOpen, setCreateOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const mobileLinks = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/reels", label: "Reels", icon: Clapperboard },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/messages", label: "Messages", icon: MessageCircle },
    { to: "/profile", label: "My Profile", icon: UserRound },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#0e1017]">

      {/* FIXED DESKTOP SIDEBAR */}
      <Sidebar
        onCreate={() => setCreateOpen(true)}
      />

      {/* MAIN APPLICATION AREA */}
      <main className="min-h-screen min-w-0 w-full bg-[#0e1017] lg:ml-[270px] lg:w-[calc(100%-270px)]">

        {/* FIXED TOP NAVBAR */}
        <Navbar
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* PAGE CONTENT */}
        <div className="w-full min-w-0 pt-[124px] md:pt-[72px] pb-24 lg:pb-0">

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onCreate={() => setCreateOpen(true)}
                />
              }
            />

            <Route
              path="/explore"
              element={<Explore />}
            />

            <Route
              path="/reels"
              element={<Reels />}
            />

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            <Route
              path="/messages"
              element={<Messages />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>

        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <MobileNav
        onCreate={() => setCreateOpen(true)}
      />

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          {/* Background overlay */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMobile}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Mobile menu */}
          <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-[#141620] p-6 shadow-2xl">

            {/* Logo */}
            <div className="mb-12 flex items-center justify-between">

              <Link
                to="/"
                onClick={closeMobile}
                className="flex items-center gap-2 text-2xl font-extrabold text-white"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold">
                  V
                </div>

                Vibely
              </Link>

              <button
                onClick={closeMobile}
                aria-label="Close menu"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={21} />
              </button>

            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex-1 space-y-2">

              {mobileLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={closeMobile}
                  className={`flex items-center gap-4 rounded-xl p-3 font-semibold transition ${
                    location.pathname === to
                      ? "bg-purple-600/15 text-purple-400"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={21} />
                  {label}
                </Link>
              ))}

              <button
                onClick={() => {
                  closeMobile();
                  setCreateOpen(true);
                }}
                className="flex w-full items-center gap-4 rounded-xl p-3 font-semibold text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <span className="text-xl">+</span>
                Create Post
              </button>

            </nav>

            <p className="border-t border-white/10 pt-5 text-center text-xs text-gray-600">
              © 2026 Vibely
            </p>

          </aside>
        </div>
      )}

      {/* GLOBAL CREATE POST MODAL */}
      <CreatePost
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

    </div>
  );
}

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/" replace />
            : <Login />
        }
      />

      {/* SIGNUP */}
      <Route
        path="/signup"
        element={
          user
            ? <Navigate to="/" replace />
            : <Signup />
        }
      />

      {/* PROTECTED PAGES */}
      <Route
        path="/*"
        element={<ProtectedLayout />}
      />

    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocialProvider>
        <AppContent />
      </SocialProvider>
    </AuthProvider>
  );
}
