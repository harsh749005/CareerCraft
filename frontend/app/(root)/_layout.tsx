import { Redirect, Stack } from "expo-router";
import { useFirebaseAuth } from "@/hooks/useFireBaseAuth";

export default function RootLayout() {
  const { isLoggedIn, isLoading } = useFirebaseAuth();

  if (isLoading) return null;

  if (isLoggedIn) {
    return <Redirect href="/OnBoardingScreen" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BuildResume" />
      <Stack.Screen name="index" />
    </Stack>
  );
}