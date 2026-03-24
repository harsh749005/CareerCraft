import React, { useState } from "react";
import OnBoardingScreen from "./OnBoardingScreen";
import AuthScreen from "./AuthScreen";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthIndex() {
  const { isSignedIn, isLoaded } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/(root)" />;

  if (showAuth) {
    return (
      <AuthScreen
        onAuthSuccess={() => {}}
        onBack={() => setShowAuth(false)}
      />
    );
  }

  return (
    <OnBoardingScreen
      onGetStarted={() => setShowAuth(true)}
    />
  );
}