import { Redirect, Stack, useSegments } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  console.log("root layout",isSignedIn)

  if (!isLoaded) return null;

  // Keep dashboard screens protected, but allow resume builder from onboarding.
  const isBuildResumeRoute = segments[1] === "BuildResume";
  if (!isSignedIn && !isBuildResumeRoute) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BuildResume" />
      <Stack.Screen name="index" />
    </Stack>
  );
}