import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const signInWithGoogle = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(root)", { scheme: "careercraft" }),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        return { success: true };
      }
      return { success: false, error: "No session created" };
    } catch (error) {
      return { success: false, error };
    }
  };

  return { signInWithGoogle };
};