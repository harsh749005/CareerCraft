import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import NoInternetScreen from "@/components/appcomp/NoNetworkScreen";
import { View, ActivityIndicator, Text } from "react-native";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Token cache for Clerk
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {}
  },
};

function RootNavigator() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  // ✅ Add a timeout fallback so loader never hangs forever
  const [clerkTimedOut, setClerkTimedOut] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  const [fontsLoaded, fontError] = useFonts({
    Inter: require("../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
    PlayfairDisplayRegular: require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
    PlayfairDisplayMedium: require("../assets/fonts/PlayfairDisplay-Medium.ttf"),
    PlayfairDisplaySemiBold: require("../assets/fonts/PlayfairDisplay-SemiBold.ttf"),
    PlayfairDisplayBold: require("../assets/fonts/PlayfairDisplay-Bold.ttf"),
    PlayfairDisplayExtraBold: require("../assets/fonts/PlayfairDisplay-ExtraBold.ttf"),
    WorkSansLight: require("../assets/fonts/WorkSans-Light.ttf"),
    WorkSansRegular: require("../assets/fonts/WorkSans-Regular.ttf"),
    WorkSansMedium: require("../assets/fonts/WorkSans-Medium.ttf"),
    WorkSansSemiBold: require("../assets/fonts/WorkSans-SemiBold.ttf"),
    WorkSansBold: require("../assets/fonts/WorkSans-Bold.ttf"),
    WorkSansExtraBold: require("../assets/fonts/WorkSans-ExtraBold.ttf"),
  });

  // ✅ NetInfo listener
  useEffect(() => {
    const checkConnection = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
      setIsChecking(false);
    };
    checkConnection();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setIsChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Splash screen hide
  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // ✅ Clerk timeout fallback — if isLoaded is still false after 5s, unblock UI
  useEffect(() => {
    if (isLoaded) return;
    const timer = setTimeout(() => {
      setClerkTimedOut(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  // ✅ Navigate based on auth state (works with timeout fallback too)
  useEffect(() => {
    if (!isLoaded && !clerkTimedOut) return;
    if (!fontsLoaded && !fontError) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && inAuthGroup) {
      router.replace("/(root)");
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)");
    }
  }, [isLoaded, isSignedIn, segments, fontsLoaded, fontError, clerkTimedOut]);

  // ✅ No internet
  if (!isChecking && isConnected === false) return <NoInternetScreen />;

  // ✅ Show loader only while genuinely loading (with timeout escape hatch)
  if ((!isLoaded && !clerkTimedOut) || (!fontsLoaded && !fontError)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F4F1DE" }}>
        <ActivityIndicator color="#3BBFAD" size="large" />
        {/* Uncomment below during debugging to see what's blocking: */}
        {/* <Text style={{ marginTop: 12, color: "#999" }}>
          fonts: {String(fontsLoaded)} | clerk: {String(isLoaded)} | net: {String(isConnected)}
        </Text> */}
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <Stack.Screen name="(root)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  // ✅ Guard against missing env var in production
  if (!CLERK_KEY) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F4F1DE" }}>
        <Text style={{ color: "red" }}>Missing CLERK key. Check your .env and eas.json.</Text>
      </View>
    );
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_KEY}
      tokenCache={tokenCache}
    >
      <RootNavigator />
    </ClerkProvider>
  );
}