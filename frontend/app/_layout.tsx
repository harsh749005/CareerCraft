import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import NoInternetScreen from "@/components/appcomp/NoNetworkScreen";
import { View, ActivityIndicator } from "react-native";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

// Token cache for Clerk
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

  const [fontsLoaded] = useFonts({
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

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!isChecking && isConnected === false) return <NoInternetScreen />;

  if (!isLoaded || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F4F1DE" }}>
        <ActivityIndicator color="#3BBFAD" size="large" />
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
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <RootNavigator />
    </ClerkProvider>
  );
}