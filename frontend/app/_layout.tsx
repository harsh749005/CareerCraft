// import PageLoader from "@/components/appcomp/PageLoader";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import NoInternetScreen from "@/components/appcomp/NoNetworkScreen";

const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  if (!clerkKey) {
    console.error("❌ Clerk publishable key is missing!");
  }
  const [fontsLoaded] = useFonts({
    // Inter
    Inter: require("../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),

    // Playfair Display
    PlayfairDisplayRegular: require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
    PlayfairDisplayMedium: require("../assets/fonts/PlayfairDisplay-Medium.ttf"),
    PlayfairDisplaySemiBold: require("../assets/fonts/PlayfairDisplay-SemiBold.ttf"),
    PlayfairDisplayBold: require("../assets/fonts/PlayfairDisplay-Bold.ttf"),
    PlayfairDisplayExtraBold: require("../assets/fonts/PlayfairDisplay-ExtraBold.ttf"),

    // Work Sans
    WorkSansLight: require("../assets/fonts/WorkSans-Light.ttf"),
    WorkSansRegular: require("../assets/fonts/WorkSans-Regular.ttf"),
    WorkSansMedium: require("../assets/fonts/WorkSans-Medium.ttf"),
    WorkSansSemiBold: require("../assets/fonts/WorkSans-SemiBold.ttf"),
    WorkSansBold: require("../assets/fonts/WorkSans-Bold.ttf"),
    WorkSansExtraBold: require("../assets/fonts/WorkSans-ExtraBold.ttf"),
  });

  // Check network connectivity on mount and listen for changes
  useEffect(() => {
    // Initial check
    const checkConnection = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
      setIsChecking(false);
    };

    checkConnection();

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setIsChecking(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Show no internet screen if not connected (after initial check)
  if (!isChecking && isConnected === false) {
    return <NoInternetScreen />;
  }

  // if (!fontsLoaded) return <PageLoader />;
  return (
    <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  );
}
