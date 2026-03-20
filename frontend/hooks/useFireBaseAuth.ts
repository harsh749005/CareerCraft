import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
//   GoogleAuthProvider,
//   signInWithCredential,
  User,
} from "firebase/auth";
import { auth } from "@/config/firebase";

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── Email Register ──
  const registerWithEmail = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // ── Email Login ──
  const loginWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // ── Google Sign In (Expo compatible) ──
  const loginWithGoogle = async () => {
    try {
      // For Expo Go use this approach:
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      // Note: signInWithPopup works on web
      // For native use expo-auth-session (see step 6)
      return { success: false, error: "Use expo-auth-session for native Google sign in" };
    } catch (error: any) {
      return { success: false, error: "Google sign in failed." };
    }
  };

  // ── Sign Out ──
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: "Sign out failed." };
    }
  };

  // ── Reset Password ──
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  return {
    user,
    isLoading,
    isLoggedIn: !!user,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    signOut,
    resetPassword,
  };
};

const getErrorMessage = (code: string): string => {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";
    default:
      return "Something went wrong. Please try again.";
  }
};