import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  // Animated,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';

export default function NoInternetScreen() {
  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleTryAgain = async () => {
    setChecking(true);
    setFailed(false);
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        console.log('Connection restored!');
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />

      {/* ── Top beige band ── */}
      <View style={styles.topBand} />

      <View style={styles.content}>

        {/* ── Illustration ── */}
        <View style={styles.illustrationWrapper}>
          {/* Background circles */}
          <View style={styles.circleOuter} />
          <View style={styles.circleInner} />

          {/* Main icon */}
          <View style={styles.iconBox}>
            <Ionicons name="wifi-outline" size={42} color="#3D405B" />
            {/* Slash overlay */}
            <View style={styles.slashLine} />
          </View>

          {/* Floating signal bars — all faded */}
          <View style={[styles.signalBar, styles.bar1]} />
          <View style={[styles.signalBar, styles.bar2]} />
          <View style={[styles.signalBar, styles.bar3]} />
        </View>

        {/* ── Text ── */}
        <Text style={styles.title}>No Connection</Text>
        <Text style={styles.message}>
          {`Looks like you're offline. Please check your internet connection and try again.`}
        </Text>

        {/* ── Failed hint ── */}
        {failed && (
          <View style={styles.failedBanner}>
            <Ionicons name="alert-circle-outline" size={15} color="#e07070" />
            <Text style={styles.failedText}>
              Still offline. Check your Wi-Fi or mobile data.
            </Text>
          </View>
        )}

        {/* ── Try Again Button ── */}
        <TouchableOpacity
          style={[styles.retryBtn, checking && styles.retryBtnLoading]}
          onPress={handleTryAgain}
          disabled={checking}
          activeOpacity={0.85}
        >
          <Ionicons
            name={checking ? "sync-outline" : "refresh-outline"}
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.retryBtnText}>
            {checking ? "Checking..." : "Try Again"}
          </Text>
        </TouchableOpacity>

        {/* ── Tips ── */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={14} color="#3BBFAD" />
            <Text style={styles.tipsTitle}>Quick fixes</Text>
          </View>
          {[
            "Toggle Airplane mode off and on",
            "Move closer to your Wi-Fi router",
            "Restart your mobile data",
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Footer status ── */}
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  topBand: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: "#F4F1DE",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: 380,
  },

  // Illustration
  illustrationWrapper: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  circleOuter: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F4F1DE",
  },
  circleInner: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e8e4d0",
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: "relative",
  },
  slashLine: {
    position: "absolute",
    width: 52,
    height: 2.5,
    backgroundColor: "#e07070",
    borderRadius: 2,
    transform: [{ rotate: "-45deg" }],
  },

  // Signal bars (decorative, faded)
  signalBar: {
    position: "absolute",
    backgroundColor: "#ccc",
    borderRadius: 2,
    opacity: 0.5,
  },
  bar1: { width: 4, height: 10, bottom: 18, right: 26 },
  bar2: { width: 4, height: 16, bottom: 18, right: 19 },
  bar3: { width: 4, height: 22, bottom: 18, right: 12 },

  // Text
  title: {
    fontSize: 28,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    fontFamily: "WorkSansRegular",
    color: "#888",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 8,
  },

  // Failed banner
  failedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff5f5",
    borderWidth: 1,
    borderColor: "#fdd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    width: "100%",
  },
  failedText: {
    fontSize: 13,
    color: "#e07070",
    fontFamily: "WorkSansRegular",
    flex: 1,
  },

  // Retry button
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3BBFAD",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 32,
    marginBottom: 24,
    width: "100%",
    justifyContent: "center",
    shadowColor: "#3BBFAD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  retryBtnLoading: {
    backgroundColor: "#81B29A",
    shadowOpacity: 0,
    elevation: 0,
  },
  retryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "WorkSansBold",
    letterSpacing: 0.5,
  },

  // Tips card
  tipsCard: {
    width: "100%",
    backgroundColor: "#F4F1DE",
    borderRadius: 16,
    padding: 16,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 13,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  tipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#3BBFAD",
  },
  tipText: {
    fontSize: 13,
    fontFamily: "WorkSansRegular",
    color: "#666",
    flex: 1,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff5f5",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fdd",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#e07070",
  },
  footerText: {
    fontSize: 12,
    fontFamily: "WorkSansRegular",
    color: "#e07070",
  },
});