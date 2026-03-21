import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import NoInternetScreen from "@/components/appcomp/NoNetworkScreen";
import { View, ActivityIndicator } from "react-native";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
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

  // ✅ Capture fontError too — fonts can fail in production builds
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

  // ✅ Hide splash whether fonts loaded OR errored
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show loader while any of these 3 are still resolving
  if (isChecking || !isLoaded || (!fontsLoaded && !fontError)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F4F1DE" }}>
        <ActivityIndicator color="#3BBFAD" size="large" />
      </View>
    );
  }

  // ✅ No internet — shown AFTER loading resolves
  if (isConnected === false) {
    return <NoInternetScreen />;
  }

  // ✅ Simple Stack — no useRouter/useSegments (caused the crash)
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
  return (
    <ClerkProvider
      publishableKey={CLERK_KEY}
      tokenCache={tokenCache}
    >
      <RootNavigator />
    </ClerkProvider>
  );
}