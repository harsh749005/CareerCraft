import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

type SplashLoaderProps = {
  onAnimationFinish?: () => void;
};

export default function SplashLoader({ onAnimationFinish }: SplashLoaderProps) {
  // ── Animation values ─────────────────────────────────────────────────────
  const fadeIn        = useRef(new Animated.Value(0)).current;
  const wordmarkY     = useRef(new Animated.Value(18)).current;
  const lineScale     = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacity    = useRef(new Animated.Value(0)).current;
  const exitOpacity   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // 1 — wordmark fades + rises in
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(wordmarkY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // 2 — decorative line expands from center
      Animated.timing(lineScale, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
        delay: 80,
      }),

      // 3 — dot + tagline appear
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // 4 — hold for a moment
      Animated.delay(820),

      // 5 — fade out entire screen
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: 480,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationFinish?.();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: exitOpacity }]}>

      {/* ── Decorative corner marks ── */}
      <View style={[styles.corner, styles.cornerTL]} />
      <View style={[styles.corner, styles.cornerTR]} />
      <View style={[styles.corner, styles.cornerBL]} />
      <View style={[styles.corner, styles.cornerBR]} />

      {/* ── Center lockup ── */}
      <View style={styles.lockup}>

        {/* Small label above */}
        <Animated.Text style={[styles.overline, { opacity: fadeIn }]}>
          YOUR CAREER, CRAFTED
        </Animated.Text>

        {/* Wordmark */}
        <Animated.Text
          style={[
            styles.wordmark,
            {
              opacity: fadeIn,
              transform: [{ translateY: wordmarkY }],
            },
          ]}
        >
          Career
          <Animated.Text style={[styles.wordmarkAccent, { opacity: dotOpacity }]}>
            Craft
          </Animated.Text>
        </Animated.Text>

        {/* Decorative rule */}
        <View style={styles.ruleWrapper}>
          <Animated.View
            style={[styles.ruleLine, { transform: [{ scaleX: lineScale }] }]}
          />
          <Animated.View style={[styles.ruleDot, { opacity: dotOpacity }]} />
          <Animated.View
            style={[styles.ruleLine, { transform: [{ scaleX: lineScale }] }]}
          />
        </View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Resumes that open doors
        </Animated.Text>

      </View>

      {/* ── Bottom edition mark ── */}
      <Animated.Text style={[styles.edition, { opacity: taglineOpacity }]}>
        ✦
      </Animated.Text>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1DE",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Corner decoration ──────────────────────────────────────────────────────
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: "#3D405B33",
  },
  cornerTL: {
    top: 48, left: 32,
    borderTopWidth: 1.5, borderLeftWidth: 1.5,
  },
  cornerTR: {
    top: 48, right: 32,
    borderTopWidth: 1.5, borderRightWidth: 1.5,
  },
  cornerBL: {
    bottom: 48, left: 32,
    borderBottomWidth: 1.5, borderLeftWidth: 1.5,
  },
  cornerBR: {
    bottom: 48, right: 32,
    borderBottomWidth: 1.5, borderRightWidth: 1.5,
  },

  // ── Center lockup ──────────────────────────────────────────────────────────
  lockup: {
    alignItems: "center",
  },

  overline: {
    fontFamily: "WorkSansLight",
    fontSize: 10,
    letterSpacing: 4,
    color: "#3D405B88",
    marginBottom: 14,
    textTransform: "uppercase",
  },

  wordmark: {
    fontFamily: "PlayfairDisplayExtraBold",
    fontSize: 48,
    color: "#3D405B",
    letterSpacing: -1,
    lineHeight: 58,
  },
  wordmarkAccent: {
    fontFamily: "PlayfairDisplayExtraBold",
    fontSize: 52,
    color: "#3BBFAD",          // your app's teal accent
    letterSpacing: -1,
  },

  // ── Decorative rule ────────────────────────────────────────────────────────
  ruleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 16,
    gap: 10,
  },
  ruleLine: {
    width: 64,
    height: 1,
    backgroundColor: "#3D405B44",
  },
  ruleDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#3BBFAD",
  },

  // ── Tagline ────────────────────────────────────────────────────────────────
  tagline: {
    fontFamily: "WorkSansLight",
    fontSize: 13,
    color: "#3D405B99",
    letterSpacing: 1.2,
    fontStyle: "italic",
  },

  // ── Bottom mark ───────────────────────────────────────────────────────────
  edition: {
    position: "absolute",
    bottom: 52,
    fontSize: 14,
    color: "#3D405B55",
    letterSpacing: 2,
  },
});