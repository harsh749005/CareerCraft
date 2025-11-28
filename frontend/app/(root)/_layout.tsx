import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null; // wait for Clerk to load

  // Case 1: Not logged in → show onboarding first
  if (!isSignedIn) {
    return <Redirect href={'/OnBoardingScreen'}/>;
  }

  // Case 2: Logged in → skip onboarding, go straight to app
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BuildResume" />
      <Stack.Screen name="Analyze" />
    </Stack>
  );
}
