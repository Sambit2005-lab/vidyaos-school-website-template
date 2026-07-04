"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { setLanguage } from "./translations";
import { auth, db } from "./firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

type Role = "super-admin" | "sansthan-admin" | "school-admin" | "teacher";
type Lang = "en" | "or";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  globalRole: "super-admin" | null;
  tenantId: string;
  tenantRole: "sansthan-admin" | "school-admin" | "teacher" | null;
  schoolId?: string;
}

interface AppContextType {
  lang: Lang;
  switchLanguage: (l: Lang) => void;
  role: Role;
  setRole: (r: Role) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (o: boolean) => void;
  demoMode: boolean;
  setDemoMode: (d: boolean) => void;
  demoLoggedIn: boolean;
  setDemoLoggedIn: (d: boolean) => void;
  user: User | null;
  userProfile: UserProfile | null;
  tenantId: string;
  setTenantId: (id: string) => void;
  logout: () => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [role, setRoleState] = useState<Role>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("vidyaos_role") as Role) || "super-admin";
    }
    return "super-admin";
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [demoMode, setDemoModeState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vidyaos_demo_mode") === "true";
    }
    return false;
  });
  const [demoLoggedIn, setDemoLoggedInState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vidyaos_demo_logged_in") === "true";
    }
    return false;
  });
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tenantId, setTenantId] = useState("sansthan-1");
  const [loading, setLoading] = useState(true);

  const setDemoMode = (val: boolean) => {
    setDemoModeState(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("vidyaos_demo_mode", String(val));
    }
  };

  const setDemoLoggedIn = (val: boolean) => {
    setDemoLoggedInState(val);
    if (typeof window !== "undefined") {
      if (val) {
        localStorage.setItem("vidyaos_demo_logged_in", "true");
      } else {
        localStorage.removeItem("vidyaos_demo_logged_in");
      }
    }
  };

  const setRole = (r: Role) => {
    setRoleState(r);
    if (typeof window !== "undefined") {
      localStorage.setItem("vidyaos_role", r);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // If we log in with real user, ensure demoMode goes false
          setDemoMode(false);
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            setUserProfile(data);
            setTenantId(data.tenantId || "sansthan-1");
            if (data.globalRole) setRole(data.globalRole);
            else if (data.tenantRole) setRole(data.tenantRole);
          } else {
            // Auto-create profile document if it is missing (common for console-created users or testers)
            const emailLower = (firebaseUser.email || "").toLowerCase();
            const isSuperAdmin = emailLower.includes("admin") || emailLower.includes("super") || emailLower.includes("codexnovas");
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
              email: firebaseUser.email || "",
              globalRole: isSuperAdmin ? "super-admin" : null,
              tenantId: "sansthan-1",
              tenantRole: isSuperAdmin ? null : "school-admin",
            };
            await setDoc(userDocRef, {
              ...newProfile,
              createdAt: new Date(),
            });
            setUserProfile(newProfile);
            if (newProfile.globalRole) setRole(newProfile.globalRole);
            else if (newProfile.tenantRole) setRole(newProfile.tenantRole);
          }
        } catch (err) {
          console.error("Error reading/seeding user profile:", err);
          // Stay in demo or allow login state
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const switchLanguage = (l: Lang) => {
    setLangState(l);
    setLanguage(l);
  };

  const logout = () => {
    auth.signOut();
    setUser(null);
    setUserProfile(null);
    setRole("super-admin");
    setDemoMode(false);
    setDemoLoggedIn(false);
    localStorage.removeItem("vidyaos_role");
  };

  return (
    <AppContext.Provider value={{
      lang, switchLanguage, role, setRole,
      sidebarOpen, setSidebarOpen,
      demoMode, setDemoMode,
      demoLoggedIn, setDemoLoggedIn,
      user, userProfile,
      tenantId, setTenantId,
      logout, loading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
