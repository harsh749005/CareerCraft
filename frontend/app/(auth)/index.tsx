import React, { useState } from "react";
import OnBoardingScreen from "./OnBoardingScreen";
import AuthScreen from "./AuthScreen";

export default function AuthIndex() {
  const [showAuth, setShowAuth] = useState(false);

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