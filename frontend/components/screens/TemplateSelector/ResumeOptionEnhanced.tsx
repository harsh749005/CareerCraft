import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

import responsive from "../../appcomp/responsive";

// Import resume templates
import resume1 from "../../../assets/images/resume/resume1.png";
import resume2 from "../../../assets/images/resume/resume2.jpg";
import resume3 from "../../../assets/images/resume/resume3.jpg";

interface ResumeOptionsProps {
  nextStep: () => void;
  updateSelectedTemplate: (template: string) => void;
  selectedIndustry?: string;
}

interface TemplateData {
  image: any;
  name: string;
  features: string[];
  industries: string[];
  description: string;
}

const ResumeOptionsEnhanced: React.FC<ResumeOptionsProps> = ({
  nextStep,
  updateSelectedTemplate,
  selectedIndustry = "it",
}) => {
  // Template database with industry associations
  const allTemplates: TemplateData[] = [
    {
      image: resume1,
      name: "Professional",
      features: ["ATS-Friendly", "Clean Layout"],
      industries: ["it", "finance", "government", "engineering"],
      description: "Classic format optimized for corporate environments",
    },
    {
      image: resume2,
      name: "Modern",
      features: ["Eye-catching", "Modern Design"],
      industries: ["it", "marketing", "creative", "education"],
      description: "Contemporary design that stands out",
    },
    {
      image: resume3,
      name: "Creative",
      features: ["Unique Style", "Creative Flair"],
      industries: ["creative", "marketing", "education"],
      description: "Bold design for creative professionals",
    },
  ];

  // Industry-specific template configurations
  const industryConfigs = {
    it: {
      title: "IT Resume Templates",
      subtitle: "Optimized for technical roles and ATS systems",
      primaryColor: "#007AFF",
    },
    finance: {
      title: "Finance Resume Templates",
      subtitle: "Professional layouts for financial services",
      primaryColor: "#34C759",
    },
    marketing: {
      title: "Marketing Resume Templates",
      subtitle: "Eye-catching designs for marketing professionals",
      primaryColor: "#FF9500",
    },
    healthcare: {
      title: "Healthcare Resume Templates",
      subtitle: "Clear, professional formats for medical fields",
      primaryColor: "#FF3B30",
    },
    education: {
      title: "Education Resume Templates",
      subtitle: "Academic-focused designs for educators",
      primaryColor: "#5856D6",
    },
    government: {
      title: "Government Resume Templates",
      subtitle: "Federal and public service compliant formats",
      primaryColor: "#8E8E93",
    },
    creative: {
      title: "Creative Resume Templates",
      subtitle: "Showcase your creativity and design skills",
      primaryColor: "#FF2D55",
    },
    engineering: {
      title: "Engineering Resume Templates",
      subtitle: "Technical layouts for engineering professionals",
      primaryColor: "#5AC8FA",
    },
  };

  // Filter templates based on selected industry
  const filteredTemplates = useMemo(() => {
    return allTemplates
      .map((template, index) => ({ ...template, originalIndex: index }))
      .filter((template) => template.industries.includes(selectedIndustry));
  }, [selectedIndustry]);

  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Animated value for button
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  const currentConfig =
    industryConfigs[selectedIndustry as keyof typeof industryConfigs] ||
    industryConfigs.it;

  // Animate button when template is selected
  useEffect(() => {
    if (selectedTemplate !== null) {
      // Animate button in
      Animated.spring(buttonAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      // Animate button out
      Animated.spring(buttonAnimation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [selectedTemplate]);

  const handleTemplateSelect = (originalIndex: number) => {
    // Toggle selection - if clicking the same template, deselect it
    if (selectedTemplate === originalIndex) {
      setSelectedTemplate(null);
      updateSelectedTemplate('');
    } else {
      setSelectedTemplate(originalIndex);
      updateSelectedTemplate(originalIndex.toString());
    }
  };

  const handleNext = async () => {
    if (selectedTemplate === null) {
      Alert.alert(
        "Select a Template",
        "Please choose a resume template to continue",
        [{ text: "OK" }]
      );
      return;
    }

    setIsLoading(true);
    try {
      await nextStep();
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Button transform animations
  const buttonTranslateY = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0], // Slide up from bottom
  });

  const buttonOpacity = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Main Scrollable Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={styles.mainScrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: responsive.fontSize(28) }]}>
              {currentConfig.title}
            </Text>
            <Text style={styles.subtitle}>{currentConfig.subtitle}</Text>
            
            {/* Industry indicator */}
            <View
              style={[
                styles.industryBadge,
                { backgroundColor: `${currentConfig.primaryColor}15` },
              ]}
            >
              <Text
                style={[
                  styles.industryBadgeText,
                  { color: currentConfig.primaryColor },
                ]}
              >
                {filteredTemplates.length} templates available
              </Text>
            </View>
          </View>

          {/* Horizontal Template Scroll - Centered */}
          <View style={styles.carouselWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={true}
              alwaysBounceHorizontal={true}
              contentContainerStyle={styles.horizontalScrollContainer}
              style={styles.horizontalScroll}
            >
              {filteredTemplates.map((template) => (
                <View key={template.originalIndex} style={styles.templateContainer}>
                  <TouchableOpacity
                    style={[
                      styles.resumeImageContainer,
                      selectedTemplate === template.originalIndex &&
                        styles.selectedImageContainer,
                      selectedTemplate === template.originalIndex && {
                        borderColor: currentConfig.primaryColor,
                      },
                    ]}
                    onPress={() => handleTemplateSelect(template.originalIndex)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={template.image}
                      style={styles.resumeImage}
                      resizeMode="contain"
                    />

                    {selectedTemplate === template.originalIndex && (
                      <View
                        style={[
                          styles.selectedBadge,
                          { backgroundColor: currentConfig.primaryColor },
                        ]}
                      >
                        <Text style={styles.selectedBadgeText}>✓ Selected</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <View style={styles.templateInfo}>
                    <Text style={styles.templateName}>{template.name}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Selection Hint - Only show when no template is selected */}
          {selectedTemplate === null && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>
                👆 Tap a template to continue
              </Text>
            </View>
          )}

          {/* Extra spacing at bottom to ensure scrollable */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Animated Action Button - Only visible when template is selected */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{ translateY: buttonTranslateY }],
              opacity: buttonOpacity,
            },
          ]}
          pointerEvents={selectedTemplate === null ? 'none' : 'auto'}
        >
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: currentConfig.primaryColor,
              },
            ]}
            onPress={handleNext}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Loading..." : "Start Building"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
};

export default ResumeOptionsEnhanced;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  mainScrollContent: {
    paddingTop: 20,
    paddingBottom: 120,
    alignItems: "center", // Center all content horizontally
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    width: "100%",
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "PlayfairDisplayRegular",
    fontSize: 28,
    color: "#333333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
    color: "#a9a9a9ff",
    textAlign: "center",
    fontFamily: "WorkSansRegular",
    marginBottom: 12,
  },
  industryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: "center",
  },
  industryBadgeText: {
    fontSize: 13,
    fontFamily: "WorkSansMedium",
  },
  carouselWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center", // Center templates vertically
  },
  templateContainer: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  resumeImageContainer: {
    width: 260,
    height: 380,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedImageContainer: {
    borderWidth: 3,
    backgroundColor: "#f0f8ff",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resumeImage: {
    width: 260,
    height: 380,
  },
  selectedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 1,
  },
  selectedBadgeText: {
    color: "white",
    fontFamily: "WorkSansMedium",
    fontSize: 12,
  },
  templateInfo: {
    alignItems: "center",
    marginTop: 15,
    width: 260,
    marginBottom: 20,
  },
  templateName: {
    fontSize: 18,
    fontFamily: "WorkSansMedium",
    color: "#333333",
    textAlign: "center",
  },
  hintContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 40,
    width: "100%",
  },
  hintText: {
    fontSize: 16,
    color: "#999999",
    fontFamily: "WorkSansRegular",
    textAlign: "center",
  },
  bottomSpacer: {
    height: 100,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    alignItems: "center", // Centers the button horizontally
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: -2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 8,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 15,
    width: "90%", // Responsive width
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "WorkSansMedium",
    color: "white",
    textAlign: "center",
  },
});