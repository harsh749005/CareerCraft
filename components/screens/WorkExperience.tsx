import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { callGeminiAPI } from "@/api/gemini";
import CustomLoader from "../appcomp/CustomLoader";
interface WorkExperienceStepProps {
  data: any;
  addExperience: any;
  updateExperience: any;
  removeExperience: any;
  nextStep: () => void;
  prevStep: () => void;
}
const WorkExperienceStep: React.FC<WorkExperienceStepProps> = ({
  data,
  addExperience,
  updateExperience,
  removeExperience,
  nextStep,
  prevStep,
}) => {
  const workExperience = data.work_experience || [];
  const [date, setDate] = useState(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState(null); // Track which experience is being generated
  const [showPicker, setShowPicker] = useState<any>({
    visible: false,
    field: null,
    index: null,
  });

  const formattedMonthYear = (currentDate: any) => {
    return currentDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const onChange = (event: any, selectedDate: any) => {
    if (event.type === "dismissed") {
      setShowPicker({ visible: false, field: null, index: null });
      return;
    }

    const currentDate = selectedDate || date;
    setDate(currentDate);

    updateExperience(
      showPicker.index,
      showPicker.field,
      formattedMonthYear(currentDate)
    );

    setShowPicker({ visible: false, field: null, index: null });
  };

  const handleNext = () => {
    if (workExperience.length === 0) {
      Alert.alert(
        "Add Work Experience",
        "Please add at least one work experience to continue",
        [{ text: "OK" }]
      );
      return;
    }

    const incompleteExperiences = workExperience.some(
      (exp: any) => !exp.company || !exp.role
    );

    if (incompleteExperiences) {
      Alert.alert(
        "Complete Required Fields",
        "Please fill in Company and Role for all experiences",
        [{ text: "OK" }]
      );
      return;
    }

    nextStep();
  };

  const handleAddExperience = () => {
    addExperience({
      company: "",
      role: "",
      year: "",
      start: "",
      end: "",
      experience: "",
    });
  };

  const handleRemoveExperience = (index: number) => {
    if (workExperience.length === 1) {
      Alert.alert(
        "Cannot Remove",
        "You need at least one work experience entry",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Remove Experience",
      "Are you sure you want to remove this work experience?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeExperience(index),
        },
      ]
    );
  };

  // Fixed generateSummary function with index parameter
  const generateSummary = async (index: any) => {
    const experience = workExperience[index];

    if (
      !experience ||
      !experience.experience ||
      experience.experience.length <= 5
    ) {
      Alert.alert(
        "Not enough content",
        "Please write at least a few words about your experience before polishing it.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsGenerating(true);
    setGeneratingIndex(index);

    try {
      const prompt = `Polish the following work experience description by improving grammar, punctuation, readability, and incorporating relevant technical terms where appropriate. 
Do not shorten , no headings or  expand the overall meaning beyond the original context. 
Return the polished version strictly as 4 clear and concise bullet points:

"${experience.experience}"`;

      const result = await callGeminiAPI(prompt);
      updateExperience(index, "experience", result);
    } catch (error) {
      console.error("Error generating summary:", error);
      Alert.alert(
        "Error",
        "Failed to polish the experience description. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsGenerating(false);
      setGeneratingIndex(null);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Progress Indicator */}
          {/* <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 3 of 4</Text>
          </View> */}
          <Text style={styles.title}>Work Experience</Text>
          <Text style={styles.subtitle}>
            Tell us about your professional background
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {workExperience.map((exp: any, index: number) => (
            <View key={index} style={styles.experienceCard}>
              <View style={styles.experienceHeader}>
                <Text style={styles.experienceTitle}>
                  Experience {index + 1}
                </Text>
                {workExperience.length > 1 && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleRemoveExperience(index)}
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Company *"
                placeholderTextColor="#a9a9a9"
                value={exp.company || ""}
                onChangeText={(val) => updateExperience(index, "company", val)}
              />

              <TextInput
                style={styles.input}
                placeholder="Role *"
                placeholderTextColor="#a9a9a9"
                value={exp.role || ""}
                onChangeText={(val) => updateExperience(index, "role", val)}
              />

              <TextInput
                style={styles.input}
                placeholder="Years of experience (e.g., 2 years)"
                placeholderTextColor="#a9a9a9"
                value={exp.year || ""}
                onChangeText={(val) => updateExperience(index, "year", val)}
              />

              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Write a few words about your experience *"
                placeholderTextColor="#a9a9a9"
                value={exp.experience || ""}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                onChangeText={(val) =>
                  updateExperience(index, "experience", val)
                }
              />

              {/* Polish Button */}
              <TouchableOpacity
                style={[
                  styles.polishButton,
                  isGenerating &&
                    generatingIndex === index &&
                    styles.polishButtonLoading,
                ]}
                onPress={() => generateSummary(index)}
                disabled={isGenerating && generatingIndex === index}
              >
                {isGenerating && generatingIndex === index ? (
                  <View style={styles.loadingContent}>
                    <CustomLoader size={16} color="#ffffff" bars={8} />
                    <Text style={styles.polishButtonTextLoading}>
                      Polishing...
                    </Text>
                  </View>
                ) : (
                  <View style={styles.polishContent}>
                    <Text style={styles.polishIcon}>✨</Text>
                    <Text style={styles.polishButtonText}>Polish with AI</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Start Date */}
              <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>
                  Start Date: {exp.start || "Not selected"}
                </Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() =>
                    setShowPicker({ visible: true, field: "start", index })
                  }
                >
                  <Text style={styles.dateButtonText}>PICK START DATE</Text>
                </TouchableOpacity>
              </View>

              {/* End Date */}
              <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>
                  End Date: {exp.end || "Not selected"}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    exp.end === "Present" && styles.dateButtonDisabled,
                  ]}
                  onPress={() =>
                    setShowPicker({ visible: true, field: "end", index })
                  }
                  disabled={exp.end === "Present"}
                >
                  <Text
                    style={[
                      styles.dateButtonText,
                      exp.end === "Present" && styles.dateButtonTextDisabled,
                    ]}
                  >
                    PICK END DATE
                  </Text>
                </TouchableOpacity>

                <View style={styles.switchContainer}>
                  <Switch
                    value={exp.end === "Present"}
                    onValueChange={(val) =>
                      updateExperience(index, "end", val ? "Present" : "")
                    }
                    trackColor={{ false: "#d0d0d0", true: "#007AFF" }}
                    thumbColor={exp.end === "Present" ? "#ffffff" : "#f4f3f4"}
                  />
                  <Text style={styles.switchLabel}>Currently working here</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Add Experience Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddExperience}
          >
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>ADD WORK EXPERIENCE</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Date Picker */}
        {showPicker.visible && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={onChange}
          />
        )}

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={prevStep}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default WorkExperienceStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#ffffff",
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
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
    color: "#a9a9a9",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
    fontFamily: "WorkSansRegular",
  },

  scrollView: {
    flex: 1,
  },

  experienceCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  experienceTitle: {
    fontSize: 18,
    color: "#666",
    fontFamily: "WorkSansMedium",
  },

  deleteButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#ff4444",
    fontSize: 12,
    fontFamily: "WorkSansMedium",
  },

  input: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#d0d0d0",
    fontFamily: "WorkSansRegular",
    fontSize: 16,
    paddingVertical: 12,
    marginBottom: 16,
    color: "#333",
  },

  multilineInput: {
    minHeight: 80,
  },

  polishButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  polishButtonLoading: {
    backgroundColor: "#5eb3ff",
  },

  polishContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  polishIcon: {
    fontSize: 16,
    marginRight: 6,
  },

  polishButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "WorkSansMedium",
    textAlign: "center",
  },

  polishButtonTextLoading: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "WorkSansRegular",
    textAlign: "center",
    marginLeft: 8,
  },

  dateSection: {
    marginBottom: 16,
  },

  dateLabel: {
    fontSize: 16,
    color: "#333",
    fontFamily: "WorkSansRegular",
    marginBottom: 8,
  },

  dateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  dateButtonDisabled: {
    backgroundColor: "#cccccc",
  },

  dateButtonText: {
    color: "white",
    textAlign: "center",
    fontFamily: "WorkSansMedium",
    fontSize: 16,
  },

  dateButtonTextDisabled: {
    color: "#666666",
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  switchLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
    fontFamily: "WorkSansRegular",
  },

  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  addButtonIcon: {
    color: "white",
    fontSize: 20,
    fontFamily: "WorkSansMedium",
    marginRight: 8,
  },

  addButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "WorkSansMedium",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },

  backButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 30,
    minWidth: 100,
  },

  backButtonText: {
    color: "#333",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "WorkSansMedium",
  },

  nextButton: {
    backgroundColor: "#000000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    minWidth: 100,
  },

  nextButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "WorkSansMedium",
  },
});
