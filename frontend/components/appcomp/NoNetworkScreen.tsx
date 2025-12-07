import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function NoInternetScreen() {
  const handleTryAgain = async () => {
    // Manually check network connection
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      // Connection restored - the root layout will automatically detect this
      // and switch back to the app
      console.log('Connection restored!');
    } else {
      console.log('Still no connection. Please check your internet settings.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>📡</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Oops...</Text>

        {/* Message */}
        <Text style={styles.message}>
          There&apos;s a connection error. Please check your internet and try again.
        </Text>

        {/* Try Again Button */}
        <TouchableOpacity 
          style={styles.buildButton}
          onPress={handleTryAgain}
          activeOpacity={0.8}
        >
          <Text style={styles.buildButtonText}>Try again</Text>
        </TouchableOpacity>
      </View>

      {/* Optional: Network status indicator */}
      <View style={styles.footer}>
        <View style={styles.statusDot} />
        <Text style={styles.footerText}>No internet connection</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  content: {
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#f5f5f5",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  iconText: {
    fontSize: 50,
    opacity: 0.7,
  },
  title: {
    fontFamily: "WorkSansSemiBold",
    fontSize: 32,
    color: "#1a1a1a",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontFamily: "WorkSansRegular",
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  buildButton: {
    backgroundColor: "#000000",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
    width: "100%",
    maxWidth: 300,
  },
  buildButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "WorkSansMedium",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4444",
  },
  footerText: {
    fontFamily: "WorkSansRegular",
    fontSize: 13,
    color: "#999999",
  },
});