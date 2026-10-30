
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

  useEffect(() => {
    if (user) {
      localStorage.setItem("vibelyUser", JSON.stringify(user));
    }
  }, [user]);

  const login = (email, password, remember = true) => {
    const registered = JSON.parse(
      localStorage.getItem("vibelyAccounts") || "[]"
    );

    const accounts = [
      { ...currentUser },
      ...registered,
    ];

    const found = accounts.find(
      (account) =>
        account.email.toLowerCase() === email.toLowerCase() &&
        account.password === password
    );

    if (!found) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const { password: ignored, ...safeUser } = found;

    setUser(safeUser);

    if (remember) {
      localStorage.setItem("vibelyUser", JSON.stringify(safeUser));
    } else {
      localStorage.removeItem("vibelyUser");
    }

    return { success: true };
  };

  const signup = (name, email, password) => {
    const accounts = JSON.parse(
      localStorage.getItem("vibelyAccounts") || "[]"
    );

    const exists = accounts.some(
      (account) =>
        account.email.toLowerCase() === email.toLowerCase()
    );

    if (
      email.toLowerCase() === currentUser.email.toLowerCase() ||
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
      username: email.split("@")[0]
        .replace(/[^a-z0-9]/gi, "")
        .toLowerCase(),
      email,
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

    setUser(safeUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("vibelyUser");
    setUser(null);
  };

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

    localStorage.setItem(
      "vibelyUser",
      JSON.stringify(updated)
    );
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
