import * as React from "react";
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
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import SafeScreen from "@/components/appcomp/SafeScreen";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  // inside your component

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setname] = React.useState("");

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [disable, setDisable] = React.useState(false);

  // 🔹 Validate form whenever inputs change
  React.useEffect(() => {
    if (
      name &&
      emailAddress &&
      password &&
      emailAddress.includes("@") &&
      password.length >= 6
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [name, emailAddress, password]);

  // 🔹 Handle Sign Up
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({ username: name,emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // 🔹 Handle Verification
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // 🔹 Show verification screen
  if (pendingVerification) {
    return (
      <SafeScreen>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Verify your email</Text>
            <TextInput
              value={code}
              placeholder="Enter your verification code"
              onChangeText={setCode}
              style={[styles.input, styles.verifyCode]}
            />
            <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeScreen>
    );
  }

  // 🔹 Show sign-up screen
  return (
    <SafeScreen>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Ready to build your resume?</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={name}
              placeholder="Your name"
              onChangeText={setname}
            />
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
              onPress={onSignUpPress}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/sign-in">
                <Text style={styles.footerLink}>Sign in</Text>
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
    textAlign:"center"
  },
  verifyCode: {
    textAlign: "center",
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
