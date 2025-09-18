import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View, ActivityIndicator } from "react-native";

export default function AuthRoutesLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait until Clerk finishes loading auth state
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Case: user is already signed in → skip auth flow
  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  // Case: user not signed in → show onboarding flow
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnBoardingScreen" options={{ title: "OnBoardingScreen" }} />
      <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />
      <Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />
    </Stack>
  );
}
