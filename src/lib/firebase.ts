import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Initialize Firebase
import { getApps, getApp } from "firebase/app";
export const app = firebaseConfig.apiKey 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;
export const auth = app ? getAuth(app) : null as any;
const centralDb = app ? getFirestore(app) : null as any;

// Export Sansthan Central connections (maps to the default app)
export const dbSansthan = centralDb;
export const authSansthan = auth;

import { enableMultiTabIndexedDbPersistence } from "firebase/firestore";
if (typeof window !== "undefined" && centralDb) {
  enableMultiTabIndexedDbPersistence(centralDb).catch((err) => {
    console.warn("Firestore persistence failed to enable:", err.code);
  });
}

/**
 * Dynamically connects to a specific school's Firebase database project.
 * Falls back to main central db if config is missing.
 */
export function getSchoolFirestoreInstance(schoolId: string, customConfig?: any) {
  if (!customConfig) {
    return centralDb; // Fallback to main central database
  }
  
  const appName = `school_${schoolId}`;
  let schoolApp;
  
  try {
    const existing = getApps().find(a => a.name === appName);
    if (existing) {
      schoolApp = existing;
    } else {
      schoolApp = initializeApp(customConfig, appName);
    }
  } catch (err) {
    console.error("Error initializing dynamic school app:", err);
    return centralDb;
  }
  
  const schoolDb = getFirestore(schoolApp);
  
  // Enable IndexedDB persistence on school-specific database connections
  if (typeof window !== "undefined" && schoolDb) {
    enableMultiTabIndexedDbPersistence(schoolDb).catch((err) => {
      console.warn(`Firestore persistence failed for ${appName}:`, err.code);
    });
  }
  
  return schoolDb;
}

// Active school config setters and resolvers
let activeSchoolId: string | null = null;
let activeSchoolConfig: any = null;

export function setActiveSchoolConfig(schoolId: string | null, config: any) {
  activeSchoolId = schoolId;
  activeSchoolConfig = config;
  if (typeof window !== "undefined") {
    if (schoolId && config) {
      localStorage.setItem("vidyaos_active_school_id", schoolId);
      localStorage.setItem("vidyaos_active_school_config", JSON.stringify(config));
    } else {
      localStorage.removeItem("vidyaos_active_school_id");
      localStorage.removeItem("vidyaos_active_school_config");
    }
  }
}

function getActiveDb() {
  if (typeof window !== "undefined") {
    const cachedId = localStorage.getItem("vidyaos_active_school_id");
    const cachedConfigStr = localStorage.getItem("vidyaos_active_school_config");
    if (cachedId && cachedConfigStr) {
      try {
        const config = JSON.parse(cachedConfigStr);
        return getSchoolFirestoreInstance(cachedId, config);
      } catch (e) {
        // Fallback to centralDb
      }
    }
  }
  
  if (activeSchoolId && activeSchoolConfig) {
    return getSchoolFirestoreInstance(activeSchoolId, activeSchoolConfig);
  }
  return centralDb;
}

// Proxy instance to transparently forward all collection/doc operations to the correct Firestore database
export const db = app ? new Proxy(centralDb || {}, {
  get(target, prop, receiver) {
    const targetDb = getActiveDb() || centralDb;
    if (!targetDb) return null;
    const value = Reflect.get(targetDb, prop, receiver);
    if (typeof value === "function") {
      return value.bind(targetDb);
    }
    return value;
  },
  set(target, prop, value, receiver) {
    const targetDb = getActiveDb() || centralDb;
    if (!targetDb) return false;
    return Reflect.set(targetDb, prop, value, receiver);
  },
  getPrototypeOf(target) {
    const targetDb = getActiveDb() || centralDb;
    if (!targetDb) return Reflect.getPrototypeOf({});
    return Reflect.getPrototypeOf(targetDb);
  }
}) as any : null;

export const analytics = typeof window !== "undefined" && app ? getAnalytics(app) : null;

// Secondary Auth instance helper to prevent logging out the current super admin
export async function createNewUserClientSide(
  email: string,
  password: string,
  profileData: {
    name: string;
    globalRole: string | null;
    tenantId: string;
    tenantRole: "sansthan-admin" | "school-admin" | "teacher" | "sub-admin";
    schoolId?: string;
    allowedSections?: string[];
  }
) {
  const secondaryAppName = "secondary-auth-app-" + Math.random().toString(36).substring(7);
  const tempApp = initializeApp(firebaseConfig, secondaryAppName);
  const tempAuth = getAuth(tempApp);
  const tempDb = getFirestore(tempApp);
  
  try {
    const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
    const newUid = userCredential.user.uid;

    // Write profile document using the temp app's firestore while the user is signed in on it!
    await setDoc(doc(tempDb, "users", newUid), {
      uid: newUid,
      email: email,
      createdAt: serverTimestamp(),
      isFirstLogin: true,
      ...profileData
    });

    await signOut(tempAuth);
    await deleteApp(tempApp);
    return userCredential.user;
  } catch (error) {
    await deleteApp(tempApp);
    throw error;
  }
}
