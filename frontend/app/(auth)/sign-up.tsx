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

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive utility functions
const responsiveWidth = (percentage: number): number => {
  return (screenWidth * percentage) / 100;
};

const responsiveHeight = (percentage: number): number => {
  return (screenHeight * percentage) / 100;
};

const responsiveFontSize = (size: number): number => {
  const scale = screenWidth / 375; // Base width (iPhone X)
  const newSize = size * scale;
  
  // Set minimum and maximum font sizes
  return Math.max(12, Math.min(newSize, 30));
};

// Screen size categories
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 768;
const isLargeScreen = screenWidth >= 768;
const isTablet = screenWidth >= 768;

// Spacing scale based on screen size
const getSpacing = (baseSpacing: number): number => {
  if (isSmallScreen) return baseSpacing * 0.8;
  if (isLargeScreen) return baseSpacing * 1.2;
  return baseSpacing;
};
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [disable, setDisable] = React.useState(false);
  const [error, setError] = React.useState(""); // Add error state
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

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        firstName: name,
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (error: unknown) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(error, null, 2));

      // Narrow error shape safely (Clerk API errors expose an `errors` array)
      if (
        error &&
        typeof error === "object" &&
        "errors" in error &&
        Array.isArray((error as any).errors) &&
        (error as any).errors.length > 0
      ) {
        const first = (error as any).errors[0];
        const errorCode: string | undefined = first?.code;
        const errorMessage: string = String(first?.message || "");

        if (
          errorCode === "form_identifier_exists" ||
          errorMessage.toLowerCase().includes("already exists") ||
          errorMessage.toLowerCase().includes("already taken")
        ) {
          setError("An account with this email address already exists. Please try signing in instead.");
        } else {
          setError(errorMessage || "An error occurred during sign up.");
        }
        return;
      }

      // Generic fallback
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <SafeScreen>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Verify your email</Text>
            <TextInput
              value={code}
              placeholder="Enter your verification code"
              placeholderTextColor="#a9a9a9"
              onChangeText={(code) => setCode(code)}
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

  return (
    <SafeScreen>
      <StatusBar barStyle="dark-content"/>
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
              placeholder="Enter name"
              placeholderTextColor="#a9a9a9"
              onChangeText={setName}
            />
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              placeholderTextColor="#a9a9a9"
              onChangeText={setEmailAddress}
              style={styles.input}
            />

            <TextInput
              value={password}
              placeholder="Enter password"
              placeholderTextColor="#a9a9a9"
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
            />
            <Text style={{fontSize:wp(3),fontFamily:"WorkSansRegular",color:"#a9a9a9"}}>• Must have 5 special keywords,letter & number</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
    textAlign: "center",
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
  errorText: {
    color: "#d9534f", // Slightly soft red
    fontSize: 13,
    marginTop: 4,
    fontFamily: "WorkSansRegular",
  },
});
