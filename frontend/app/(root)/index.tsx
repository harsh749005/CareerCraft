import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React from "react";
import SafeScreen from "@/components/appcomp/SafeScreen";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeScreen>
        <ScrollView style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.title}>CareerCraft</Text>
              <Text style={styles.subtitle}>
                Build, analyze, and optimize your resume with AI-powered tools
              </Text>
            </View>

            {/* Main Features */}
            <View style={styles.featuresSection}>
              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push("/(root)/BuildResume")}
                activeOpacity={0.8}
              >
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>📝</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Build Resume</Text>
                  <Text style={styles.featureDescription}>
                    Create a professional, ATS-friendly resume tailored to your career goals
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push("/(root)/Analyze")}
                activeOpacity={0.8}
              >
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>🔍</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Analyze Resume</Text>
                  <Text style={styles.featureDescription}>
                    Get instant feedback with AI-powered insights and recommendations
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Coming Soon Features */}
              <View style={[styles.featureCard, styles.disabledCard]}>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>🎯</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Job Match Score</Text>
                  <Text style={styles.featureDescription}>
                    Compare your resume against job descriptions for better matches
                  </Text>
                </View>
              </View>

              <View style={[styles.featureCard, styles.disabledCard]}>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>📚</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Resume Templates</Text>
                  <Text style={styles.featureDescription}>
                    Choose from industry-specific templates designed by experts
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats Section */}
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Why Use Resume Analyzer?</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>95%</Text>
                  <Text style={styles.statLabel}>ATS Compatible</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>10K+</Text>
                  <Text style={styles.statLabel}>Resumes Analyzed</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>3x</Text>
                  <Text style={styles.statLabel}>Interview Rate</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeScreen>
    </>
  );
};

export default Index;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 30,
  },
  title: {
    fontFamily: "PlayfairDisplayRegular",
    fontSize: 32,
    textAlign: "center",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: "WorkSansRegular",
    fontSize: 16,
    textAlign: "center",
    color: "#666666",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresSection: {
    marginBottom: 30,
  },
  featureCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  disabledCard: {
    opacity: 0.6,
  },
  comingSoonBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    fontFamily: "WorkSansMedium",
    fontSize: 11,
    color: "#666666",
  },
  featureIcon: {
    width: 50,
    height: 50,
    backgroundColor: "#000000",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: "WorkSansSemiBold",
    fontSize: 18,
    color: "#1a1a1a",
    marginBottom: 6,
  },
  featureDescription: {
    fontFamily: "WorkSansRegular",
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  statsContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 24,
    marginTop: 10,
  },
  statsTitle: {
    fontFamily: "WorkSansSemiBold",
    fontSize: 20,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap:6
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontFamily: "WorkSansBold",
    fontSize: 28,
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "WorkSansRegular",
    fontSize: 11,
    color: "#cccccc",
    textAlign: "center",
  },
});