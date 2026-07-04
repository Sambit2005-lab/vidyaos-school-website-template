import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_FIREBASE_API_KEY) || (typeof globalThis !== "undefined" && (globalThis as any).process && (globalThis as any).process.env && ((globalThis as any).process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (globalThis as any).process.env.VITE_FIREBASE_API_KEY)) || "",
  authDomain: (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN) || (typeof globalThis !== "undefined" && (globalThis as any).process && (globalThis as any).process.env && ((globalThis as any).process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || (globalThis as any).process.env.VITE_FIREBASE_AUTH_DOMAIN)) || "",
  projectId: (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_FIREBASE_PROJECT_ID) || (typeof globalThis !== "undefined" && (globalThis as any).process && (globalThis as any).process.env && ((globalThis as any).process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || (globalThis as any).process.env.VITE_FIREBASE_PROJECT_ID)) || "",
  storageBucket: (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET) || (typeof globalThis !== "undefined" && (globalThis as any).process && (globalThis as any).process.env && ((globalThis as any).process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (globalThis as any).process.env.VITE_FIREBASE_STORAGE_BUCKET)) || "",
  messagingSenderId: (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID) || (typeof globalThis !== "undefined" && (globalThis as any).process && (globalThis as any).process.env && ((globalThis as any).process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || (globalThis as any).process.env.VITE_FIREBASE_MESSAGING_SENDER_ID)) || "",
  appId: (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_FIREBASE_APP_ID) || (typeof globalThis !== "undefined" && (globalThis as any).process && (globalThis as any).process.env && ((globalThis as any).process.env.NEXT_PUBLIC_FIREBASE_APP_ID || (globalThis as any).process.env.VITE_FIREBASE_APP_ID)) || "",
  measurementId: (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID) || (typeof globalThis !== "undefined" && (globalThis as any).process && (globalThis as any).process.env && ((globalThis as any).process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || (globalThis as any).process.env.VITE_FIREBASE_MEASUREMENT_ID)) || ""
};

// Initialize Firebase
import { getApps, getApp } from "firebase/app";
export const app = firebaseConfig.apiKey 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;
export const auth = app ? getAuth(app) : null as any;
export const db = app ? getFirestore(app) : null as any;

import { enableMultiTabIndexedDbPersistence } from "firebase/firestore";
if (typeof window !== "undefined" && db) {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    console.warn("Firestore persistence failed to enable:", err.code);
  });
}

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
