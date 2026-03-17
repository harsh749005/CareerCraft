import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  data: any;
  addEducation: (edu: any) => void;
  updateEducation: (index: number, field: string, value: string) => void;
  removeEducationExperience: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  step: number;
  totalSteps: number;
}

const EducationStep: React.FC<Props> = ({
  data,
  addEducation,
  updateEducation,
  removeEducationExperience,
  nextStep,
  prevStep,
  step,
  totalSteps,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isPresent, setIsPresent] = useState(false);
  const edu = data.education?.[0] || {};

  const renderInput = (label: string, key: string) => {
    const value = edu[key] || "";
    const isFocused = focusedField === key;

    return (
      <View style={styles.inputContainer}>
        {/* 🔹 Floating Label */}
        {(value || isFocused) && <Text style={styles.label}>{label}</Text>}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={isFocused ? "" : label}
            placeholderTextColor="#aaa"
            value={value}
            onFocus={() => setFocusedField(key)}
            onBlur={() => setFocusedField(null)}
            onChangeText={(val) => updateEducation(0, key, val)}
          />
          {/* ✅ Green Tick */}
          {value && (
            <Ionicons name="checkmark-circle" size={20} color="#81B29A" />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Navbar */}
      <View style={styles.navbar}>
  
  {/* 🔹 Left */}
  <TouchableOpacity onPress={prevStep} style={styles.leftIcon}>
    <Ionicons name="arrow-back" size={22} color="#3D405B" />
  </TouchableOpacity>

  {/* 🔹 Center (ABSOLUTE) */}
  <View style={styles.centerContent}>
    <Text style={styles.stepText}>
      Step {step} of {totalSteps}
    </Text>
    <Text style={styles.title}>EDUCATION</Text>
  </View>

  {/* 🔹 Right */}
  <TouchableOpacity style={styles.rightBtn}>
    <Text style={styles.previewText}>Preview</Text>
  </TouchableOpacity>

</View>

      {/* 🔹 Title */}

      <Text style={styles.mainHeading}>Tell us about your education</Text>

      <Text style={styles.subHeading}>
        {`Include every school, even if you're still there or didn’t graduate`}
      </Text>

      {/* 🔹 Inputs */}

      {renderInput("Institution", "institution")}
      {renderInput("Degree", "degree")}
      {renderInput("Result / CGPA", "result")}
      {/* 🔹 Start Date */}
      <Text style={styles.label}>Start Date</Text>
      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.dateInput}>
          <Text style={styles.dateText}>Month</Text>
          <Ionicons name="calendar-outline" size={16} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateInput}>
          <Text style={styles.dateText}>Year</Text>
          <Ionicons name="calendar-outline" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* 🔹 Graduation Date */}
      <Text style={styles.label}>Graduation Date</Text>
      <View style={styles.dateRow}>
        <TouchableOpacity
          style={[styles.dateInput, isPresent && styles.disabledInput]}
          disabled={isPresent}
        >
          <Text style={styles.dateText}>Month</Text>
          <Ionicons name="calendar-outline" size={16} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dateInput, isPresent && styles.disabledInput]}
          disabled={isPresent}
        >
          <Text style={styles.dateText}>Year</Text>
          <Ionicons name="calendar-outline" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* 🔹 Present Checkbox */}
      <View style={styles.presentRow}>
        <Text style={styles.presentText}>Present</Text>
        <TouchableOpacity
          style={[styles.checkbox, isPresent && styles.checkboxActive]}
          onPress={() => setIsPresent(!isPresent)}
        >
          {isPresent && <Ionicons name="checkmark" size={14} color="#fff" />}
        </TouchableOpacity>
      </View>

      {/* 🔹 Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
          <Text style={styles.nextText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EducationStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1DE",
    paddingHorizontal: 20,
  },

  navbar: {
    height: 50,
    justifyContent: "center",
  },
  
  leftIcon: {
    position: "absolute",
    left: 0,
  },
  
  rightBtn: {
    position: "absolute",
    right: 0,
  },
  
  centerContent: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },

  stepText: {
    fontFamily: "WorkSansRegular",
    fontSize: 12,
    color: "#3D405B",
  },

  previewText: {
    color: "#81B29A",
    fontFamily: "WorkSansSemiBold",
    // backgroundColor: "orange",
    // fontSize: 6,
  },

  title: {
    // marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    letterSpacing: 1,
    color: "#6c6c6c",
    fontFamily: "WorkSansBold",
  },

  mainHeading: {
    marginTop: 10,
    fontSize: 30,
    textAlign: "left",
    color: "#3D405B",
    fontFamily: "PlayfairDisplayBold",
  },

  subHeading: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "left",
    color: "#6c6c6c",
    fontFamily: "WorkSansRegular",
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#ccc",
    paddingBottom: 6,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: "WorkSansRegular",
  },

  label: {
    fontSize: 12,
    color: "#3D405B",
    fontFamily: "WorkSansSemiBold",
    marginBottom: 6,
  },

  dateRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  dateInput: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  dateText: {
    color: "#666",
    fontFamily: "WorkSansRegular",
  },

  disabledInput: {
    opacity: 0.4,
  },

  presentRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30,
  },

  presentText: {
    marginRight: 8,
    fontFamily: "WorkSansMedium",
    color: "#3D405B",
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxActive: {
    backgroundColor: "#81B29A",
    borderColor: "#81B29A",
  },

  continueBtn: {
    backgroundColor: "#81B29A",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 20,
  },

  inputContainer: {
    marginBottom: 20,
  },

  nextBtn: {
    backgroundColor: "#81B29A",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "100%",
  },

  nextText: {
    color: "#fff",
    fontFamily: "WorkSansBold",
    fontSize: 16,
    textAlign: "center",
  },
});
