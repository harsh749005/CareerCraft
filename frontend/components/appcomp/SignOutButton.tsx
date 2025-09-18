import { useClerk } from "@clerk/clerk-expo";
import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to onboarding screen after logout
      router.replace("/(auth)/OnBoardingScreen");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
  );
};
