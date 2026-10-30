
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { currentUser } from "../data/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vibelyUser")) || null;
    } catch {
      return null;
    }
  });

  const [rememberUser, setRememberUser] = useState(true);

  useEffect(() => {
    if (user && rememberUser) {
      localStorage.setItem("vibelyUser", JSON.stringify(user));
    } else if (!rememberUser) {
      localStorage.removeItem("vibelyUser");
    }
  }, [user, rememberUser]);

  // LOGIN - Accept any non-empty email and password
  const login = (email, password, remember = true) => {
    if (!email?.trim() || !password?.trim()) {
      return {
        success: false,
        message: "Please enter email and password.",
      };
    }

    const normalizedEmail = email.trim().toLowerCase();

    const registered = JSON.parse(
      localStorage.getItem("vibelyAccounts") || "[]"
    );

    const accounts = [
      { ...currentUser },
      ...registered,
    ];

    // Use an existing profile if the email is already registered.
    const found = accounts.find(
      (account) =>
        account.email?.toLowerCase() === normalizedEmail
    );

    let loggedInUser;

    if (found) {
      const { password: ignored, ...safeUser } = found;
      loggedInUser = safeUser;
    } else {
      // Create a temporary demo profile for any new email.
      const name = normalizedEmail.split("@")[0] || "Vibely User";

      loggedInUser = {
        id: Date.now(),
        name,
        username: name.replace(/[^a-z0-9]/gi, "").toLowerCase(),
        email: normalizedEmail,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff`,
        bio: "Welcome to my Vibely profile ✨",
        followers: 0,
        following: 0,
      };
    }

    setRememberUser(remember);
    setUser(loggedInUser);

    if (remember) {
      localStorage.setItem(
        "vibelyUser",
        JSON.stringify(loggedInUser)
      );
    } else {
      localStorage.removeItem("vibelyUser");
    }

    return { success: true };
  };

  // SIGNUP
  const signup = (name, email, password) => {
    const accounts = JSON.parse(
      localStorage.getItem("vibelyAccounts") || "[]"
    );

    const normalizedEmail = email.trim().toLowerCase();

    const exists = accounts.some(
      (account) =>
        account.email.toLowerCase() === normalizedEmail
    );

    if (
      normalizedEmail === currentUser.email.toLowerCase() ||
      exists
    ) {
      return {
        success: false,
        message: "Email already registered.",
      };
    }

    const account = {
      id: Date.now(),
      name,
      username: normalizedEmail.split("@")[0]
        .replace(/[^a-z0-9]/gi, "")
        .toLowerCase(),
      email: normalizedEmail,
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff`,
      bio: "Welcome to my Vibely profile ✨",
      followers: 0,
      following: 0,
    };

    localStorage.setItem(
      "vibelyAccounts",
      JSON.stringify([...accounts, account])
    );

    const { password: ignored, ...safeUser } = account;

    setRememberUser(true);
    setUser(safeUser);

    return { success: true };
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("vibelyUser");
    setRememberUser(false);
    setUser(null);
  };

  // UPDATE PROFILE
  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };

    setUser(updated);

    const accounts = JSON.parse(
      localStorage.getItem("vibelyAccounts") || "[]"
    );

    const nextAccounts = accounts.map((account) =>
      account.id === updated.id
        ? { ...account, ...updates }
        : account
    );

    localStorage.setItem(
      "vibelyAccounts",
      JSON.stringify(nextAccounts)
    );

    if (rememberUser) {
      localStorage.setItem(
        "vibelyUser",
        JSON.stringify(updated)
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
