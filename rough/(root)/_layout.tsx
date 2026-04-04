import { Redirect, Stack, useSegments } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { api } from "../../services/apiServices";

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const segments = useSegments();

  // Sync user to Neon DB once after login
  useEffect(() => {
    if (user?.id) {
      api.syncUser(
        user.id,
        user.emailAddresses[0].emailAddress
      );
    }
  }, [user?.id]);

  console.log("root layout", isSignedIn);

  if (!isLoaded) return null;

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