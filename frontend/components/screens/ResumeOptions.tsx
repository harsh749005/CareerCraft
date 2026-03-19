import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const templates = [
  {
    image: require("../../assets/images/resume/resume1.png"),
    name: "Classic",
    tag: "Most Popular",
    tagColor: "#3BBFAD",
  },
  {
    image: require("../../assets/images/resume/resume2.jpg"),
    name: "Modern",
    tag: "Clean & Bold",
    tagColor: "#81B29A",
  },
  {
    image: require("../../assets/images/resume/resume2.jpg"),
    name: "Executive",
    tag: "Professional",
    tagColor: "#3D405B",
  },
  {
    image: require("../../assets/images/resume/resume3.jpg"),
    name: "Creative",
    tag: "Stand Out",
    tagColor: "#E07A5F",
  },
];

export default function ResumeOptions({
  nextStep,
  prevStep,
  updateSelectedTemplate,
  step,
  totalSteps,
}: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleScroll = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (width * 0.72 + 20)
    );
    setCurrentIndex(index);
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    updateSelectedTemplate(`template_${index + 1}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />

      {/* ── Navbar ── */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/(root)")} style={styles.leftIcon}>
          <Ionicons name="arrow-back" size={22} color="#3D405B" />
        </TouchableOpacity>
        <View style={styles.centerContent}>
          <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
          <Text style={styles.navTitle}>TEMPLATES</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Heading ── */}
      <View style={styles.headingBlock}>
        <Text style={styles.mainHeading}>
          Find the perfect template for your resume
        </Text>
        <Text style={styles.subHeading}>
          Swipe to browse — tap to select your favourite
        </Text>
      </View>

      {/* ── Template Slider ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width * 0.72 + 20}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContainer}
      >
        {templates.map((template, index) => {
          const isSelected = selectedIndex === index;
          const isCurrent = currentIndex === index;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(index)}
              activeOpacity={0.9}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
                isCurrent && !isSelected && styles.cardCurrent,
              ]}
            >
              {/* Tag badge */}
              <View style={[styles.tagBadge, { backgroundColor: template.tagColor }]}>
                <Text style={styles.tagText}>{template.tag}</Text>
              </View>

              {/* Template image */}
              <Image source={template.image} style={styles.image} resizeMode="cover" />

              {/* Selected overlay */}
              {isSelected && (
                <View style={styles.selectedOverlay}>
                  <View style={styles.selectedCheck}>
                    <Ionicons name="checkmark" size={22} color="#fff" />
                  </View>
                </View>
              )}

              {/* Footer */}
              <View style={[styles.cardFooter, isSelected && styles.cardFooterSelected]}>
                <Text style={[styles.templateName, isSelected && styles.templateNameSelected]}>
                  {template.name}
                </Text>
                {isSelected ? (
                  <View style={styles.selectedPill}>
                    <Ionicons name="checkmark-circle" size={14} color="#fff" />
                    <Text style={styles.selectedPillText}>Selected</Text>
                  </View>
                ) : (
                  <Text style={styles.tapToSelect}>Tap to select</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Dot Indicators ── */}
      <View style={styles.dotsRow}>
        {templates.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.dotActive,
              selectedIndex === index && styles.dotSelected,
            ]}
          />
        ))}
      </View>

      {/* ── Template name label ── */}
      <View style={styles.currentLabel}>
        <Text style={styles.currentLabelText}>
          {templates[currentIndex].name}
        </Text>
        <Text style={styles.currentCounter}>
          {currentIndex + 1} / {templates.length}
        </Text>
      </View>

      {/* ── Selected info strip ── */}
      {selectedIndex !== null && (
        <View style={styles.selectedStrip}>
          <Ionicons name="checkmark-circle" size={16} color="#3BBFAD" />
          <Text style={styles.selectedStripText}>
            {templates[selectedIndex].name} template selected
          </Text>
        </View>
      )}

      {/* ── Continue Button ── */}
      <TouchableOpacity
        style={[
          styles.continueBtn,
          selectedIndex === null && styles.continueBtnDisabled,
        ]}
        onPress={nextStep}
        disabled={selectedIndex === null}
        activeOpacity={0.88}
      >
        <Text style={styles.continueBtnText}>
          {selectedIndex === null ? "Select a Template" : "CONTINUE"}
        </Text>
        {selectedIndex !== null && (
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1DE",
  },

  // Navbar
  navbar: {
    height: 56,
    backgroundColor: "#F4F1DE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  leftIcon:      { position: "absolute", left: 20 },
  centerContent: { flex: 1, alignItems: "center" },
  stepText: {
    fontSize: 11,
    color: "#3D405B",
    fontFamily: "WorkSansRegular",
  },
  navTitle: {
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#3D405B",
    fontFamily: "WorkSansBold",
  },

  // Heading
  headingBlock: {
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 4,
  },
  mainHeading: {
    fontSize: 26,
    color: "#3D405B",
    fontFamily: "PlayfairDisplayBold",
    lineHeight: 34,
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 14,
    color: "#888",
    fontFamily: "WorkSansRegular",
  },

  // Slider
  scrollContainer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 20,
  },

  card: {
    width: width * 0.72,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardCurrent: {
    borderColor: "#ddd",
  },
  cardSelected: {
    borderColor: "#3BBFAD",
    shadowColor: "#3BBFAD",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },

  // Tag badge
  tagBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 10,
  },
  tagText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "WorkSansSemiBold",
    letterSpacing: 0.3,
  },

  image: {
    width: "100%",
    height: 360,
  },

  // Selected overlay
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(59,191,173,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCheck: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#3BBFAD",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3BBFAD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  // Card footer
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cardFooterSelected: {
    backgroundColor: "#f0faf8",
    borderTopColor: "#c8e8e0",
  },
  templateName: {
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  templateNameSelected: {
    color: "#3BBFAD",
  },
  tapToSelect: {
    fontSize: 12,
    color: "#bbb",
    fontFamily: "WorkSansRegular",
  },
  selectedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#3BBFAD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  selectedPillText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "WorkSansSemiBold",
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
  },
  dotActive: {
    width: 18,
    backgroundColor: "#3D405B",
    borderRadius: 3,
  },
  dotSelected: {
    backgroundColor: "#3BBFAD",
  },

  // Current label
  currentLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  currentLabelText: {
    fontSize: 16,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  currentCounter: {
    fontSize: 13,
    color: "#888",
    fontFamily: "WorkSansRegular",
  },

  // Selected strip
  selectedStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#e8f5f2",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c8e8e0",
  },
  selectedStripText: {
    fontSize: 13,
    color: "#3D405B",
    fontFamily: "WorkSansSemiBold",
  },

  // Continue
  continueBtn: {
    flexDirection: "row",
    backgroundColor: "#3BBFAD",
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 24,
  },
  continueBtnDisabled: {
    backgroundColor: "#ccc",
  },
  continueBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1.5,
    fontFamily: "WorkSansBold",
  },
});