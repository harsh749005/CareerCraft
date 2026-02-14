import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import responsive from "../appcomp/responsive";


// ✅ Direct imports
import resume1 from "../../assets/images/resume/resume1.png";
import resume2 from "../../assets/images/resume/resume2.jpg";
import resume3 from "../../assets/images/resume/resume3.jpg";
import { SignOutButton } from "../appcomp/SignOutButton";
interface ResumeOptionsProps {
  nextStep: () => void;
  updateSelectedTemplate: (template: string) => void;
}
const ResumeOptions: React.FC<ResumeOptionsProps> = ({
  nextStep,
  updateSelectedTemplate,
}) => {
  // Responsive helpers


  const resumeTemplates = [resume1, resume2, resume3];
  const templateNames = ["Professional", "Modern", "Creative"];
  const templateFeatures = [
    ["ATS-Friendly", "Clean Layout"],
    ["Eye-catching", "Modern Design"],
    ["Unique Style", "Creative Flair"],
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTemplateSelect = (index: any) => {
    setSelectedTemplate(index);
    updateSelectedTemplate(index);
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

  return (
    <>
      <StatusBar barStyle="dark-content" />
   
      <View style={styles.container}>
         <View style={styles.header}>
          {/* <SignOutButton/> */}
          {/* Progress Indicator */}
          {/* <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 3 of 4</Text>
          </View> */}
          <Text style={[styles.title, { fontSize: responsive.fontSize(28) }]}>Resume Templates</Text>
          <Text style={[styles.subtitle, { }]}>
            Find the perfect design for your professional profile
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={true}
          alwaysBounceHorizontal={true}
          overScrollMode="always"
          contentContainerStyle={styles.scrollContainer}
        >
          {resumeTemplates.map((template, index) => (
            <View key={index} style={styles.templateContainer}>
            <TouchableOpacity
                style={[
                  styles.resumeImageContainer,
                 ,
                  selectedTemplate === index && styles.selectedImageContainer,
                ]}
                onPress={() => handleTemplateSelect(index)}
                activeOpacity={0.8}
              >
                <Image
                  source={template}
                  style={styles.resumeImage} 
                  resizeMode="contain"
                />

                {/* Selected Badge */}
                {selectedTemplate === index && (
 <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓ Selected</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Template Info */}
              {/* <View style={styles.templateInfo}>
              <Text style={styles.templateName}>{templateNames[index]}</Text>
              <View style={styles.featuresContainer}>
                  {templateFeatures[index].map((feature, featureIndex) => (
                    <View key={featureIndex} style={styles.featureTag}>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View> */}
            </View>
          ))}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}> 
           <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  selectedTemplate !== null ? "#000000" : "#cccccc",
              },
            ]}
            onPress={handleNext}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.buttonText,
                { color: selectedTemplate !== null ? "white" : "#666666" },
              ]}
            >
              {isLoading ? "Loading..." : "Start Building"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ResumeOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  stepIndicator: {
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    // borderRadius: 20,
    marginBottom: 16,
  },
  stepText: {
    fontSize: 12,
    fontFamily: "WorkSansMedium",
    color: "#007AFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  },

  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  templateContainer: {
    alignItems: "center",
    marginHorizontal: 10,
  },

  resumeImageContainer: {
    // borderRadius: 12,
    width: 260,
    height: 380,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    position: "relative",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },

  selectedImageContainer: {
    
    borderColor: "#007AFF",
    borderWidth: 3,
    backgroundColor: "#f0f8ff",
    // Enhanced shadow when selected
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    
  },

  resumeImage: {
    // borderRadius: 8,
    width: 260,
    height: 380,
  },

  selectedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#007AFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    // borderRadius: 15,
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
  },

  templateName: {
    fontSize: 18,
    fontFamily: "WorkSansMedium",
    color: "#333333",
    marginBottom: 8,
  },

  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
  },

  featureTag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    // borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  featureText: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "WorkSansRegular",
  },

  buttonContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },

  button: {
    alignItems: "center",
    // borderRadius: 8,
    // Shadow
    paddingHorizontal: 40,
    paddingVertical: 15,
    // borderRadius: 8,
    minWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  buttonText: {
    fontSize: 18,
    fontFamily: "WorkSansMedium",
  },

  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  progressText: {
    fontSize: 14,
    color: "#999999",
    fontFamily: "WorkSansMedium",
  },
});
