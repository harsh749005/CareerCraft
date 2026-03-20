import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import * as Application from "expo-application";
import { Ionicons } from "@expo/vector-icons";
interface OnBoardingScreenProps {
  onGetStarted: () => void;  // ← add this
}

const OnBoardingScreen: React.FC<OnBoardingScreenProps> = ({ onGetStarted }) => {
  const appVersion = Application.nativeApplicationVersion;

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const steps = [
    {
      icon: "document-text-outline",
      number: "01",
      title: "Fill in your details",
      desc: "Add your experience, education, and skills in minutes.",
    },
    {
      icon: "color-wand-outline",
      number: "02",
      title: "AI polishes your content",
      desc: "Our AI refines your bullet points for maximum impact.",
    },
    {
      icon: "download-outline",
      number: "03",
      title: "Export as PDF",
      desc: "Download a professional resume ready to send.",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />

      {/* ✅ ScrollView wraps everything */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* ── Top beige section ── */}
        <Animated.View
          style={[
            styles.topSection,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Navbar — no Sign In button */}
          <View style={styles.navbar}>
            <View style={styles.logoRow}>
              <View style={styles.logoDot} />
              <Text style={styles.logoText}>
                Career<Text style={styles.logoAccent}>Craft</Text>
              </Text>
            </View>
          </View>

          {/* Hero illustration */}
          <View style={styles.heroCard}>
            {/* Resume mockup */}
            <View style={styles.resumeMockup}>
              <View style={styles.mockHeader}>
                <View style={styles.mockAvatar} />
                <View style={styles.mockHeaderLines}>
                  <View style={[styles.mockLine, { width: "70%", height: 8 }]} />
                  <View style={[styles.mockLine, { width: "50%", height: 6, marginTop: 5 }]} />
                </View>
              </View>
              <View style={styles.mockBody}>
                {[80, 60, 90, 55, 75, 40].map((w, i) => (
                  <View
                    key={i}
                    style={[
                      styles.mockLine,
                      {
                        width: `${w}%`,
                        height: i % 3 === 0 ? 8 : 5,
                        marginBottom: i % 3 === 0 ? 10 : 5,
                        backgroundColor: i % 3 === 0 ? "#3BBFAD" : "#e8e4d0",
                      },
                    ]}
                  />
                ))}
              </View>
              <View style={styles.mockChips}>
                {["React", "Node.js", "Python"].map((s, i) => (
                  <View key={i} style={styles.mockChip}>
                    <Text style={styles.mockChipText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Floating badges */}
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeIcon}>✦</Text>
              <Text style={styles.aiBadgeText}>AI Enhanced</Text>
            </View>
            <View style={styles.checkBadge}>
              <Ionicons name="checkmark-circle" size={18} color="#3BBFAD" />
              <Text style={styles.checkBadgeText}>ATS Ready</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Bottom white section ── */}
        <Animated.View
          style={[
            styles.bottomSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* ✅ PlayfairDisplayBold heading */}
          <Text style={styles.mainHeading}>
            Build your perfect{"\n"}resume in minutes
          </Text>

          {/* ✅ WorkSansSemiBold subheading */}
          <Text style={styles.subHeading}>
            CareerCraft helps you create professional, ATS-friendly resumes that get you hired faster.
          </Text>

          {/* Steps */}
          <View style={styles.stepsBlock}>
            {steps.map((s, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View style={styles.stepIconBox}>
                    <Ionicons name={s.icon as any} size={18} color="#3BBFAD" />
                  </View>
                  {i < steps.length - 1 && <View style={styles.stepConnector} />}
                </View>
                <View style={styles.stepRight}>
                  <Text style={styles.stepNumber}>{s.number}</Text>
                  <Text style={styles.stepTitle}>{s.title}</Text>
                  <Text style={styles.stepDesc}>{s.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By continuing you agree to our{" "}
            <Text style={styles.termsLink}>Terms of Use</Text>
            {" and "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          {/* CTA */}
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.push("/(root)/BuildResume")}
            activeOpacity={0.88}
          >
            <Text style={styles.ctaBtnText}>Create my Resume</Text>
            <View style={styles.ctaArrow}>
              <Ionicons name="arrow-forward" size={18} color="#3BBFAD" />
            </View>
          </TouchableOpacity>

          {/* Version */}
          <Text style={styles.versionText}>v{appVersion}</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Top beige
  topSection: {
    backgroundColor: "#F4F1DE",
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  // Navbar — no Sign In button, logo only
  navbar: {
    flexDirection: "row",
    justifyContent: "flex-start", // ✅ left aligned since no button
    alignItems: "center",
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3BBFAD",
  },
  logoText: {
    fontSize: 22,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
  },
  logoAccent: {
    color: "#3BBFAD",
    fontFamily: "PlayfairDisplayBold",
  },

  // Hero card
  heroCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 5,
    position: "relative",
  },

  resumeMockup: { width: "100%" },
  mockHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0ede0",
  },
  mockAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e8f5f2",
    borderWidth: 2,
    borderColor: "#3BBFAD",
  },
  mockHeaderLines: { flex: 1 },
  mockBody:        { marginBottom: 12 },
  mockLine: {
    backgroundColor: "#e8e4d0",
    borderRadius: 4,
    marginBottom: 6,
  },
  mockChips: { flexDirection: "row", gap: 8 },
  mockChip: {
    backgroundColor: "#e8f5f2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c8e8e0",
  },
  mockChipText: {
    fontSize: 11,
    color: "#3BBFAD",
    fontFamily: "WorkSansSemiBold",
  },

  aiBadge: {
    position: "absolute",
    top: -12,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#3D405B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  aiBadgeIcon: { fontSize: 12, color: "#3BBFAD" },
  aiBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "WorkSansSemiBold",
  },
  checkBadge: {
    position: "absolute",
    bottom: -12,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c8e8e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  checkBadgeText: {
    fontSize: 12,
    color: "#3D405B",
    fontFamily: "WorkSansSemiBold",
  },

  // Bottom white
  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },

  // ✅ PlayfairDisplayBold for main heading
  mainHeading: {
    fontSize: 30,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
    lineHeight: 38,
    marginBottom: 10,
  },

  // ✅ WorkSansSemiBold for subheading
  subHeading: {
    fontSize: 14,
    fontFamily: "WorkSansSemiBold",
    color: "#888",
    lineHeight: 22,
    marginBottom: 28,
  },

  // Steps
  stepsBlock: { marginBottom: 24 },
  stepRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 4,
  },
  stepLeft: {
    alignItems: "center",
    width: 40,
  },
  stepIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#e8f5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  stepConnector: {
    width: 2,
    flex: 1,
    backgroundColor: "#e8e4d0",
    marginVertical: 4,
    minHeight: 20,
  },
  stepRight: {
    flex: 1,
    paddingBottom: 20,
  },
  stepNumber: {
    fontSize: 10,
    fontFamily: "WorkSansBold",
    color: "#3BBFAD",
    letterSpacing: 1,
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
    marginBottom: 3,
  },
  stepDesc: {
    fontSize: 13,
    fontFamily: "WorkSansRegular",
    color: "#888",
    lineHeight: 20,
  },

  // Terms
  termsText: {
    fontSize: 12,
    color: "#aaa",
    fontFamily: "WorkSansRegular",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  termsLink: {
    color: "#3BBFAD",
    fontFamily: "WorkSansSemiBold",
    textDecorationLine: "underline",
  },

  // CTA
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3BBFAD",
    paddingVertical: 18,
    borderRadius: 32,
    marginBottom: 16,
    shadowColor: "#3BBFAD",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "WorkSansBold",
    letterSpacing: 0.5,
    marginRight: 10,
  },
  ctaArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  versionText: {
    textAlign: "center",
    fontSize: 11,
    color: "#ccc",
    fontFamily: "WorkSansRegular",
  },
});