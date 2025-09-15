import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
interface EducationStepProps {
  data: any;
  addEducation: any;
  updateEducation: any;
  removeEducationExperience: any;
  nextStep: () => void;
  prevStep: () => void;
}
const EducationStep: React.FC<EducationStepProps> = ({
  data,
  addEducation,
  updateEducation,
  removeEducationExperience,
  nextStep,
  prevStep,
}) => {
  const education = data.education || [];
  const [date, setDate] = useState(new Date());
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

    // Save directly into Education
    updateEducation(
      showPicker.index,
      showPicker.field,
      formattedMonthYear(currentDate)
    );

    setShowPicker({ visible: false, field: null, index: null });
  };
  const handleNext = () => {
    if (education.length === 0) {
      Alert.alert(
        "Add Education Details",
        "Please add at least one education detail to continue",
        [{ text: "OK" }]
      );
      return;
    }

    // Validate required fields
    const incompleteEducation = education.some(
      (edu: any) => !edu.institution || !edu.degree || !edu.result
    );

    if (incompleteEducation) {
      Alert.alert(
        "Complete Required Fields",
        "Please fill in Fields for all experiences",
        [{ text: "OK" }]
      );
      return;
    }

    nextStep();
  };

  const handleAddEducation = () => {
    addEducation({
      institution: "",
      degree: "",
      result: "",
    });
  };

  const handleRemoveExperience = (index: number) => {
    if (education.length === 1) {
      Alert.alert(
        "Cannot Remove",
        "You need at least one work education entry",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Remove Experience",
      "Are you sure you want to remove this education details?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeEducationExperience(index),
        },
      ]
    );
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
          <Text style={styles.title}>Education</Text>
          <Text style={styles.subtitle}>
            Tell us about your education background
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {education.map((edu: any, index: number) => (
            <View key={index} style={styles.card}>
              <View style={styles.secondaryHeader}>
                <Text style={styles.secondaryTitle}>
                  Experience {index + 1}
                </Text>
                {education.length > 1 && (
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
                placeholder="School/University *"
                value={edu.institution || ""}
                onChangeText={(val) =>
                  updateEducation(index, "institution", val)
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Degree *"
                value={edu.degree || ""}
                onChangeText={(val) => updateEducation(index, "degree", val)}
              />
              <TextInput
                style={styles.input}
                placeholder="cgpa/10 or percentage *"
                value={edu.result || ""}
                onChangeText={(val) => updateEducation(index, "result", val)}
              />

              {/* Start Date */}
              <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>
                  Start Date: {edu.start || "Not selected"}
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
                  End Date: {edu.end || "Not selected"}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    edu.end === "Present" && styles.dateButtonDisabled,
                  ]}
                  onPress={() =>
                    setShowPicker({ visible: true, field: "end", index })
                  }
                  disabled={edu.end === "Present"}
                >
                  <Text
                    style={[
                      styles.dateButtonText,
                      edu.end === "Present" && styles.dateButtonTextDisabled,
                    ]}
                  >
                    PICK END DATE
                  </Text>
                </TouchableOpacity>

                <View style={styles.switchContainer}>
                  <Switch
                    value={edu.end === "Present"}
                    onValueChange={(val) =>
                      updateEducation(index, "end", val ? "Present" : "")
                    }
                    trackColor={{ false: "#d0d0d0", true: "#007AFF" }}
                    thumbColor={edu.end === "Present" ? "#ffffff" : "#f4f3f4"}
                  />
                  <Text style={styles.switchLabel}>
                    Currently pursuing here
                  </Text>
                </View>
              </View>
            </View>

            // dates
          ))}
          {/* Add Experience Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddEducation}
          >
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>ADD EDUCATION DETAILS</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Date Picker */}
        {showPicker.visible && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={onChange}
            style={{ backgroundColor: "white" }}
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

export default EducationStep;

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

  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    // borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 2,
  },
  secondaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  secondaryTitle: {
    fontSize: 18,
    color: "#666",
    fontFamily: "WorkSansMedium",
  },
  deleteButton: {
    width: 30,
    height: 30,
    // borderRadius: 15,
    // backgroundColor: "transparent",
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
    // borderRadius: 8,
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
    // borderRadius: 8,
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // Shadow
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
    // borderRadius: 8,
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
    // borderRadius: 8,
    minWidth: 100,
  },

  nextButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "WorkSansMedium",
  },

  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  progressText: {
    fontSize: 14,
    color: "#999999",
    fontFamily: "WorkSansRegular",
  },
});
