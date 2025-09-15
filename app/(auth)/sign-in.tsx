import React, { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import SafeScreen from "@/components/appcomp/SafeScreen";

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [disable, setDisable] = useState(false);

  // 🔹 Validate form whenever inputs change
  useEffect(() => {
    if (
      emailAddress &&
      password &&
      emailAddress.includes("@") &&
      password.length >= 6
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [emailAddress, password]);
  // 🔹 Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password) {
      setDisable(true);
      // Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!emailAddress.includes("@")) {
      setDisable(true);
      // Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setDisable(true);
      // Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    setDisable(false);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/"); // redirect to home
      } else {
        console.error(
          "Sign-in not complete:",
          JSON.stringify(signInAttempt, null, 2)
        );
      }
    } catch (err) {
      console.error("Sign-in error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <SafeScreen>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>
              Welcome back, ready to get started?
            </Text>
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              onChangeText={setEmailAddress}
              style={styles.input}
            />

            <TextInput
              value={password}
              placeholder="Enter password"
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
            />

            <TouchableOpacity
              disabled={disable} 
              style={disable ? styles.disablebutton : styles.button}
              onPress={onSignInPress}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>{`Don't have an account?`} </Text>
              <Link href="/sign-up">
                <Text style={styles.footerLink}>Sign Up</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width * 0.9,
    alignSelf: "center",
    flex: 1,
    justifyContent: "center",
    gap: 30,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  keyboardView: {
    flex: 1,
  },
  title: {
    fontFamily: "PlayfairDisplayRegular",
    fontSize: 28,
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    fontFamily: "PlayfairDisplayRegular",
    fontSize: 18,
    paddingVertical: 6,
  },
  disablebutton: {
    backgroundColor: "gray",
    padding: 14,
    alignItems: "center",
    opacity: 0.8,
  },
  button: {
    backgroundColor: "black",
    padding: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "WorkSansBold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "WorkSansRegular",
  },
  footerLink: {
    fontSize: 14,
    fontFamily: "WorkSansMedium",
    color: "#000",
  },
});
