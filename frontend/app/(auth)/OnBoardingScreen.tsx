import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // or react-native-linear-gradient
import { router } from "expo-router";


const OnboardingScreen = () => {
  const handleSignUp = () => {
    // Navigate to sign up screen
    // console.log('Sign Up pressed');
    router.push("/(auth)/sign-up");
  };

  const handleSignIn = () => {
    // Navigate to sign in screen
    // console.log('Sign In pressed');
    router.push("/(auth)/sign-in");
  };

  return (
    <>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[
          "#FF6B6B", // Red-orange at top
          "#FF8E8E", // Light red
          "#ED78DD", // Pinkish purple
          "#DDA0DD", // Plum
          "#B19CD9", // Purple
          "#d2d2d2ff", // Light gray/white at bottom
        ]}
        locations={[0, 0.01, 0.45, 0.6, 0.75, 1]}
        start={{ x: 1, y: 0 }} // top-left corner
        end={{ x: 0, y: 1 }} // bottom-right corner
        style={styles.gradient}
      >
        {/* Main content */}
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Create Your Perfect Resume</Text>
            <Text style={styles.subtitle}>
              Build professional resumes with our easy-to-use templates and land
              your dream job
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 50,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: "black",
    textAlign: "center",
    marginBottom: 16,
    // lineHeight: 38,
    fontFamily: "PlayfairDisplayMedium",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
    fontFamily: "WorkSansRegular",
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  signUpButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signUpButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "WorkSansBold",
    textAlign: "center",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontFamily: "WorkSansRegular",
  },
  signInLink: {
    color: "#000",
    fontSize: 16,
    fontFamily: "WorkSansMedium",
  },
});

export default OnboardingScreen;
