import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PickerModal from "../model/Pickermodel";
interface Props {
  data: any;
  addEducation: (edu: any) => void;
  updateEducation: (
    index: number,
    field: string | Record<string, string>,
    value?: string,
  ) => void;
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
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [activeField, setActiveField] = useState("");
  const months = [
    "None",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 52 }, (_, i) => (2036 - i).toString());

  const [focusedField, setFocusedField] = useState<string | null>(null);
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
  // const isPresent = !edu.end_month && !edu.end_year;
  const [isPresent, setIsPresent] = useState(false);
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
        {/* Start Month */}
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => {
            setActiveField("start_month");
            setShowMonthPicker(true);
          }}
        >
          <Text>{edu.start_month || "Month"}</Text>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={edu.start_month ? "#81B29A" : "#666"}
          />
        </TouchableOpacity>
        {/* Start Year */}
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => {
            setActiveField("start_year");
            setShowYearPicker(true);
          }}
        >
          <Text>{edu.start_year || "Year"}</Text>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={edu.start_year ? "#81B29A" : "#666"}
          />
        </TouchableOpacity>
      </View>

      {/* 🔹 Graduation Date */}
      <Text style={styles.label}>Graduation Date</Text>
      <View style={styles.dateRow}>
        <TouchableOpacity
          style={styles.dateInput}
          disabled={isPresent}
          onPress={() => {
            setActiveField("end_month");
            setShowMonthPicker(true);
          }}
        >
          <Text>{edu.end_month || "Month"}</Text>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={edu.end_month ? "#81B29A" : "#666"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateInput}
          disabled={isPresent}
          onPress={() => {
            setActiveField("end_year");
            setShowYearPicker(true);
          }}
        >
          <Text>{edu.end_year || "Year"}</Text>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={edu.end_year ? "#81B29A" : "#666"}
          />
        </TouchableOpacity>
      </View>

      {/* 🔹 Present Checkbox */}
      <View style={styles.presentRow}>
        <Text style={styles.presentText}>Present</Text>
        <TouchableOpacity
          style={[
            styles.checkbox,
            isPresent ? styles.checkboxActive : styles.checkbox,
          ]}
          onPress={() => {
            const next = !isPresent;
            setIsPresent(next);

            if (!isPresent) {
              updateEducation(0, {
                end_month: "",
                end_year: "",
              });
            }
          }}
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
      {/* Month Picker Model */}
      <PickerModal
        visible={showMonthPicker}
        title="Month"
        data={months}
        selectedValue={edu[activeField] || ""}
        onClose={() => setShowMonthPicker(false)}
        onSelect={(value) => {
          updateEducation(0, activeField, value === "None" ? "" : value);
          setShowMonthPicker(false);
        }}
      />
      {/* Year Picker Model */}
      <PickerModal
        visible={showYearPicker}
        title="Year"
        data={years}
        selectedValue={edu[activeField] || ""}
        onClose={() => setShowYearPicker(false)}
        onSelect={(value) => {
          updateEducation(0, activeField, value);
          setShowYearPicker(false);
        }}
      />
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
    flexDirection: "row",
    justifyContent: "space-between", // 🔥 pushes icon right
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#ccc",
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
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "60%",
  },

  closeBtn: {
    position: "absolute",
    top: 10,
    right: 0,
    backgroundColor: "#81B29A",
    width: 20,
    height: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: "WorkSansBold",
    color: "#3D405B",
  },

  monthItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  selectedMonthItem: {
    borderColor: "#81B29A",
    backgroundColor: "#f7fbf9",
  },
  monthText: {
    fontSize: 16,
    fontFamily: "WorkSansRegular",
    color: "#333",
  },

  selectedMonthText: {
    color: "#81B29A",
    fontFamily: "WorkSansSemiBold",
  },
  yearItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  selectedYearItem: {
    borderColor: "#81B29A",
    backgroundColor: "#f7fbf9",
  },

  yearText: {
    fontSize: 16,
    fontFamily: "WorkSansRegular",
    color: "#333",
  },

  selectedYearText: {
    color: "#81B29A",
    fontFamily: "WorkSansSemiBold",
  },
});
