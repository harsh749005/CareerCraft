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
  updatePersonalInfo: any;
  nextStep: () => void;
  prevStep: () => void;
  step: number;
  totalSteps: number;
}

const PersonalInfoStep: React.FC<Props> = ({
  data,
  updatePersonalInfo,
  nextStep,
  prevStep,
  step,
  totalSteps,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const renderInput = (
    label: string,
    key: string,
    keyboardType: any = "default",
  ) => {
    const value = data[key] || "";
    const isFocused = focusedField === key;

    return (
      <View style={styles.inputContainer}>
        {(value || isFocused) && <Text style={styles.label}>{label}</Text>}

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={isFocused ? "" : label}
            placeholderTextColor="#aaa"
            value={value}
            keyboardType={keyboardType}
            onFocus={() => setFocusedField(key)}
            onBlur={() => setFocusedField(null)}
            onChangeText={(val) => updatePersonalInfo(key, val)}
          />

          {/* ✅ Green Tick */}
          {value.length > 0 && (
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
        <TouchableOpacity onPress={prevStep}>
          <Ionicons name="arrow-back" size={22} color="#3D405B" />
        </TouchableOpacity>

        <Text style={styles.stepText}>
          Step {step} of {totalSteps}
        </Text>

        <TouchableOpacity>
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Title */}
      <Text style={styles.title}>Contact Details</Text>

      {/* 🔹 Heading */}
      <Text style={styles.mainHeading}>
        What’s the best way for employers to contact you?
      </Text>

      <Text style={styles.subHeading}>
        We suggest including an email and phone number
      </Text>

      {/* 🔹 Inputs */}
      {renderInput("Name", "name")}
      {renderInput("Email", "email", "email-address")}
      {renderInput("Phone Number", "number", "numeric")}

      {/* 🔹 Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
          <Text style={styles.nextText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonalInfoStep;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1DE",
    // paddingTop: 60,
    paddingHorizontal: 20,
  },

  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  stepText: {
    fontFamily: "WorkSansMedium",
    color: "#3D405B",
  },

  previewText: {
    color: "#81B29A",
    fontFamily: "WorkSansSemiBold",
  },

  title: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    letterSpacing: 1,
    color: "#6c6c6c",
    fontFamily: "WorkSansMedium",
  },

  mainHeading: {
    marginTop: 10,
    fontSize: 24,
    textAlign: "center",
    color: "#3D405B",
    fontFamily: "PlayfairDisplayBold",
  },

  subHeading: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#6c6c6c",
    fontFamily: "WorkSansRegular",
    marginBottom: 30,
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 12,
    color: "#3D405B",
    marginBottom: 4,
    fontFamily: "WorkSansSemiBold",
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

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
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
