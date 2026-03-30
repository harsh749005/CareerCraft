import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import * as Application from "expo-application";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface OnBoardingScreenProps {
  onGetStarted: () => void;
}

const OnBoardingScreen: React.FC<OnBoardingScreenProps> = ({ onGetStarted }) => {
  const appVersion = Application.nativeApplicationVersion;

  // Main animations
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  // Individual card animations
  const card1Y    = useRef(new Animated.Value(60)).current;
  const card2Y    = useRef(new Animated.Value(60)).current;
  const card3Y    = useRef(new Animated.Value(60)).current;
  const badge1Anim = useRef(new Animated.Value(0)).current;
  const badge2Anim = useRef(new Animated.Value(0)).current;
  const badge3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      // Fade + slide bottom section
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 700, useNativeDriver: true }),

      // Stagger card entries
      Animated.spring(card1Y, { toValue: 0, delay: 100, tension: 55, friction: 9, useNativeDriver: true }),
      Animated.spring(card2Y, { toValue: 0, delay: 250, tension: 55, friction: 9, useNativeDriver: true }),
      Animated.spring(card3Y, { toValue: 0, delay: 400, tension: 55, friction: 9, useNativeDriver: true }),

      // Badges fade in after cards
      Animated.timing(badge1Anim, { toValue: 1, duration: 500, delay: 700, useNativeDriver: true }),
      Animated.timing(badge2Anim, { toValue: 1, duration: 500, delay: 850, useNativeDriver: true }),
      Animated.timing(badge3Anim, { toValue: 1, duration: 500, delay: 1000, useNativeDriver: true }),
    ]).start();
  }, []);

  const steps = [
    { icon: "document-text-outline", number: "01", title: "Fill in your details",    desc: "Add your experience, education, and skills in minutes." },
    { icon: "color-wand-outline",    number: "02", title: "AI polishes your content", desc: "Our AI refines your bullet points for maximum impact." },
    { icon: "download-outline",      number: "03", title: "Export as PDF",            desc: "Download a professional resume ready to send." },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* ── Top beige section ── */}
        <Animated.View style={[styles.topSection, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>

          {/* Navbar */}
          <View style={styles.navbar}>
            <View style={styles.logoRow}>
              <View style={styles.logoDot} />
              <Text style={styles.logoText}>
                Career<Text style={styles.logoAccent}>Craft</Text>
              </Text>
            </View>
          </View>

          {/* ── NEW Hero: Stacked card layout ── */}
          <View style={styles.heroContainer}>

            {/* ── Decorative background blobs ── */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            {/* ── Card 3 (back) — skills card ── */}
            <Animated.View style={[
              styles.floatingCard,
              styles.cardBack,
              { transform: [{ translateY: card3Y }, { rotate: "5deg" }] },
            ]}>
              <View style={styles.cardChipRow}>
                {["Figma", "Swift", "AWS"].map((s, i) => (
                  <View key={i} style={[styles.miniChip, { backgroundColor: i === 0 ? "#f0e8ff" : i === 1 ? "#fff0e8" : "#e8f0ff" }]}>
                    <Text style={[styles.miniChipText, { color: i === 0 ? "#9b59b6" : i === 1 ? "#e67e22" : "#2980b9" }]}>{s}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.cardProgressRow}>
                <View style={[styles.cardProgressBar, { width: "85%", backgroundColor: "#9b59b6" }]} />
                <View style={[styles.cardProgressBar, { width: "70%", backgroundColor: "#e67e22" }]} />
                <View style={[styles.cardProgressBar, { width: "90%", backgroundColor: "#2980b9" }]} />
              </View>
            </Animated.View>

            {/* ── Card 2 (middle) — experience card ── */}
            <Animated.View style={[
              styles.floatingCard,
              styles.cardMiddle,
              { transform: [{ translateY: card2Y }, { rotate: "-4deg" }] },
            ]}>
              <View style={styles.cardExpHeader}>
                <View style={styles.cardExpIconBox}>
                  <Ionicons name="briefcase-outline" size={14} color="#3BBFAD" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={[styles.miniLine, { width: "60%", backgroundColor: "#3D405B", height: 7 }]} />
                  <View style={[styles.miniLine, { width: "40%", backgroundColor: "#aaa", height: 5, marginTop: 4 }]} />
                </View>
              </View>
              <View style={{ gap: 5, marginTop: 8 }}>
                <View style={[styles.miniLine, { width: "90%", backgroundColor: "#eee" }]} />
                <View style={[styles.miniLine, { width: "75%", backgroundColor: "#eee" }]} />
                <View style={[styles.miniLine, { width: "82%", backgroundColor: "#eee" }]} />
              </View>
            </Animated.View>

            {/* ── Card 1 (front) — main resume card ── */}
            <Animated.View style={[
              styles.floatingCard,
              styles.cardFront,
              { transform: [{ translateY: card1Y }] },
            ]}>
              {/* Profile row */}
              <View style={styles.cardProfileRow}>
                <View style={styles.cardAvatar}>
                  <Ionicons name="person" size={18} color="#3BBFAD" />
                </View>
                <View style={{ flex: 1, gap: 5 }}>
                  <View style={[styles.miniLine, { width: "55%", backgroundColor: "#3D405B", height: 8 }]} />
                  <View style={[styles.miniLine, { width: "40%", backgroundColor: "#aaa", height: 5 }]} />
                </View>
                <View style={styles.cardCheckmark}>
                  <Ionicons name="checkmark-circle" size={16} color="#3BBFAD" />
                </View>
              </View>

              {/* Teal accent line */}
              <View style={styles.cardAccentLine} />

              {/* Content */}
              <View style={{ gap: 5, marginBottom: 10 }}>
                <View style={[styles.miniLine, { width: "80%", backgroundColor: "#3BBFAD", height: 6, opacity: 0.3 }]} />
                <View style={[styles.miniLine, { width: "92%", backgroundColor: "#e0e0e0" }]} />
                <View style={[styles.miniLine, { width: "76%", backgroundColor: "#e0e0e0" }]} />
                <View style={[styles.miniLine, { width: "88%", backgroundColor: "#e0e0e0" }]} />
              </View>

              {/* Section 2 */}
              <View style={{ gap: 5, marginBottom: 12 }}>
                <View style={[styles.miniLine, { width: "40%", backgroundColor: "#3BBFAD", height: 6, opacity: 0.3 }]} />
                <View style={[styles.miniLine, { width: "85%", backgroundColor: "#e0e0e0" }]} />
                <View style={[styles.miniLine, { width: "70%", backgroundColor: "#e0e0e0" }]} />
              </View>

              {/* Skill chips */}
              <View style={styles.cardChipRow}>
                {["React", "Node.js", "Python"].map((s, i) => (
                  <View key={i} style={styles.cardChip}>
                    <Text style={styles.cardChipText}>{s}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* ── Floating badges ── */}
            <Animated.View style={[styles.aiBadge, { opacity: badge1Anim }]}>
              <Text style={styles.aiBadgeIcon}>✦</Text>
              <Text style={styles.aiBadgeText}>AI Enhanced</Text>
            </Animated.View>

            <Animated.View style={[styles.atsBadge, { opacity: badge2Anim }]}>
              <Ionicons name="checkmark-circle" size={14} color="#3BBFAD" />
              <Text style={styles.atsBadgeText}>ATS Ready</Text>
            </Animated.View>

            <Animated.View style={[styles.pdfBadge, { opacity: badge3Anim }]}>
              <Ionicons name="document-text-outline" size={13} color="#fff" />
              <Text style={styles.pdfBadgeText}>PDF Export</Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* ── Bottom white section ── */}
        <Animated.View style={[
          styles.bottomSection,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}>
          <Text style={styles.mainHeading}>
            Build your perfect{"\n"}resume in minutes
          </Text>
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
    paddingBottom: 50,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },

  // Navbar
  navbar: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: 28 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  logoDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#3BBFAD" },
  logoText: { fontSize: 22, fontFamily: "PlayfairDisplayBold", color: "#3D405B" },
  logoAccent: { color: "#3BBFAD", fontFamily: "PlayfairDisplayBold" },

  // ── Hero container ──
  heroContainer: {
    height: 260,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  // Background blobs
  blob1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(59,191,173,0.12)",
    top: -20,
    right: -20,
  },
  blob2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(61,64,91,0.06)",
    bottom: 0,
    left: 0,
  },

  // ── Floating cards ──
  floatingCard: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },

  // Card positions
  cardFront: {
    width: width * 0.62,
    zIndex: 10,
    top: 20,
    left: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardMiddle: {
    width: width * 0.52,
    zIndex: 5,
    top: 10,
    right: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    backgroundColor: "#fafff9",
  },
  cardBack: {
    width: width * 0.44,
    zIndex: 1,
    bottom: 10,
    right: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    backgroundColor: "#fafafa",
  },

  // Card internals
  cardProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  cardAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e8f5f2",
    borderWidth: 1.5,
    borderColor: "#3BBFAD",
    justifyContent: "center",
    alignItems: "center",
  },
  cardCheckmark: { marginLeft: "auto" },
  cardAccentLine: {
    height: 3,
    width: "40%",
    backgroundColor: "#3BBFAD",
    borderRadius: 2,
    marginBottom: 10,
  },

  miniLine: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e0e0e0",
  },

  cardChipRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  cardChip: {
    backgroundColor: "#e8f5f2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c8e8e0",
  },
  cardChipText: { fontSize: 10, color: "#3BBFAD", fontFamily: "WorkSansSemiBold" },

  // Card exp (middle card)
  cardExpHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardExpIconBox: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: "#e8f5f2",
    justifyContent: "center", alignItems: "center",
  },

  // Card progress (back card)
  cardProgressRow: { gap: 5, marginTop: 8 },
  cardProgressBar: { height: 6, borderRadius: 3 },

  miniChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  miniChipText: { fontSize: 10, fontFamily: "WorkSansSemiBold" },

  // Floating badges
  aiBadge: {
    position: "absolute",
    top: 0,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#3D405B",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 20,
    shadowColor: "#3D405B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  aiBadgeIcon: { fontSize: 11, color: "#3BBFAD" },
  aiBadgeText: { fontSize: 11, color: "#fff", fontFamily: "WorkSansSemiBold" },

  atsBadge: {
    position: "absolute",
    bottom: 0,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c8e8e0",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
  },
  atsBadgeText: { fontSize: 11, color: "#3D405B", fontFamily: "WorkSansSemiBold" },

  pdfBadge: {
    position: "absolute",
    bottom: 30,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#3BBFAD",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 20,
    shadowColor: "#3BBFAD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  pdfBadgeText: { fontSize: 11, color: "#fff", fontFamily: "WorkSansSemiBold" },

  // Bottom white
  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },

  mainHeading: {
    fontSize: 30,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
    lineHeight: 38,
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 14,
    fontFamily: "WorkSansSemiBold",
    color: "#888",
    lineHeight: 22,
    marginBottom: 28,
  },

  // Steps
  stepsBlock: { marginBottom: 24 },
  stepRow: { flexDirection: "row", gap: 14, marginBottom: 4 },
  stepLeft: { alignItems: "center", width: 40 },
  stepIconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "#e8f5f2",
    justifyContent: "center", alignItems: "center",
  },
  stepConnector: {
    width: 2, flex: 1, backgroundColor: "#e8e4d0",
    marginVertical: 4, minHeight: 20,
  },
  stepRight: { flex: 1, paddingBottom: 20 },
  stepNumber: { fontSize: 10, fontFamily: "WorkSansBold", color: "#3BBFAD", letterSpacing: 1, marginBottom: 2 },
  stepTitle:  { fontSize: 15, fontFamily: "WorkSansSemiBold", color: "#3D405B", marginBottom: 3 },
  stepDesc:   { fontSize: 13, fontFamily: "WorkSansRegular",  color: "#888", lineHeight: 20 },

  // Terms
  termsText: {
    fontSize: 12, color: "#aaa", fontFamily: "WorkSansRegular",
    textAlign: "center", lineHeight: 20, marginBottom: 16,
  },
  termsLink: { color: "#3BBFAD", fontFamily: "WorkSansSemiBold", textDecorationLine: "underline" },

  // CTA
  ctaBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#3BBFAD", paddingVertical: 18, borderRadius: 32, marginBottom: 16,
    shadowColor: "#3BBFAD", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  ctaBtnText: { color: "#fff", fontSize: 16, fontFamily: "WorkSansBold", letterSpacing: 0.5, marginRight: 10 },
  ctaArrow: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "#fff", justifyContent: "center", alignItems: "center",
  },

  versionText: { textAlign: "center", fontSize: 11, color: "#ccc", fontFamily: "WorkSansRegular" },
});