import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
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
  const fields = [
    {
      key: "name",
      label: "Full Name",
      placeholder: "e.g. John Doe",
      icon: "person-outline",
      keyboard: "default",
    },
    {
      key: "email",
      label: "Email Address",
      placeholder: "e.g. john@email.com",
      icon: "mail-outline",
      keyboard: "email-address",
    },
    {
      key: "number",
      label: "Phone Number",
      placeholder: "e.g. +91 98765 43210",
      icon: "call-outline",
      keyboard: "phone-pad",
    },
    {
      key: "city",
      label: "City",
      placeholder: "e.g. Mumbai",
      icon: "location-outline",
      keyboard: "default",
    },
    {
      key: "country",
      label: "Country",
      placeholder: "e.g. India",
      icon: "globe-outline",
      keyboard: "default",
    },
    // {
    //   key: "job_title",
    //   label: "Job Title",
    //   placeholder: "e.g. Full Stack Developer",
    //   icon: "briefcase-outline",
    //   keyboard: "default",
    // },
  ];

  const filledCount = fields.filter((f) => !!data[f.key]).length;
  const progressPercent = Math.round((filledCount / fields.length) * 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />

      {/* ── Navbar ── */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={prevStep} style={styles.leftIcon}>
          <Ionicons name="arrow-back" size={22} color="#3D405B" />
        </TouchableOpacity>
        <View style={styles.centerContent}>
          <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
          <Text style={styles.navTitle}>CONTACT DETAILS</Text>
        </View>
        <TouchableOpacity style={styles.rightBtn}>
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Heading ── */}
        <View style={styles.headingBlock}>
          <Text style={styles.mainHeading}>
            {`What's the best way for employers to contact you?`}
          </Text>
          <Text style={styles.subHeading}>
            We suggest including an email and phone number
          </Text>
        </View>

        {/* ── Progress bar ── */}
        <View style={styles.progressBlock}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Profile completeness</Text>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* ── Fields ── */}
        <View style={styles.fieldsBlock}>
          {fields.map(({ key, label, placeholder, icon, keyboard }) => {
            const value = data[key] || "";
            const isFocused = focusedField === key;
            const hasValue = !!value;

            return (
              <View key={key} style={styles.fieldContainer}>
                {/* Floating label */}
                {(hasValue || isFocused) && (
                  <Text style={styles.floatingLabel}>{label.toUpperCase()}</Text>
                )}

                <View style={styles.fieldRow}>
                  {/* Left icon */}
                  <Ionicons
                    name={icon as any}
                    size={18}
                    color={isFocused ? "#3BBFAD" : hasValue ? "#3D405B" : "#bbb"}
                    style={styles.fieldIcon}
                  />

                  {/* Input */}
                  <TextInput
                    style={styles.fieldInput}
                    placeholder={isFocused ? placeholder : label}
                    placeholderTextColor="#bbb"
                    value={value}
                    keyboardType={keyboard as any}
                    autoCapitalize={key === "email" ? "none" : "words"}
                    onFocus={() => setFocusedField(key)}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={(val) => updatePersonalInfo(key, val)}
                  />

                  {/* Right checkmark */}
                  {hasValue && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#3BBFAD"
                    />
                  )}
                </View>

                {/* Underline */}
                <View
                  style={[
                    styles.underline,
                    isFocused && styles.underlineFocused,
                    hasValue && !isFocused && styles.underlineFilled,
                  ]}
                />
              </View>
            );
          })}
        </View>

        {/* ── Info tip ── */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconBox}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#3BBFAD" />
          </View>
          <Text style={styles.tipText}>
            Your contact details are only shared with employers you apply to
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Continue Button ── */}
      <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
        <Text style={styles.continueText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PersonalInfoStep;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Navbar
  navbar: {
    height: 56,
    backgroundColor: "#F4F1DE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  leftIcon:      { position: "absolute", left: 20 },
  rightBtn:      { position: "absolute", right: 20 },
  centerContent: { flex: 1, alignItems: "center" },
  stepText: {
    fontSize: 11,
    color: "#3D405B",
    fontFamily: "WorkSansRegular",
  },
  navTitle: {
    fontSize: 14,
    // fontWeight: "bold",
    letterSpacing: 1,
    color: "#3D405B",
    fontFamily: "WorkSansBold",
  },
  previewText: {
    color: "#3BBFAD",
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
  },

  scrollContent: { paddingBottom: 20 },

  // Heading
  headingBlock: {
    paddingHorizontal: 20,
    paddingTop: 28,
    marginBottom: 20,
  },
  mainHeading: {
    fontSize: 28,
    color: "#3D405B",
    fontFamily: "PlayfairDisplayBold",
    lineHeight: 36,
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 14,
    color: "#888",
    fontFamily: "WorkSansRegular",
    lineHeight: 22,
  },

  // Progress
  progressBlock: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: "#888",
    fontFamily: "WorkSansRegular",
  },
  progressPercent: {
    fontSize: 12,
    color: "#3BBFAD",
    fontFamily: "WorkSansSemiBold",
  },
  progressTrack: {
    height: 4,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    backgroundColor: "#3BBFAD",
    borderRadius: 4,
  },

  // Fields
  fieldsBlock: { paddingHorizontal: 20 },
  fieldContainer: { marginBottom: 22 },
  floatingLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#3D405B",
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily: "WorkSansSemiBold",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  fieldIcon: { marginRight: 10 },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: "#3D405B",
    paddingVertical: 8,
    fontFamily: "WorkSansRegular",
  },
  underline: {
    height: 1,
    backgroundColor: "#eee",
    marginTop: 4,
  },
  underlineFocused: {
    height: 1.5,
    backgroundColor: "#3BBFAD",
  },
  underlineFilled: {
    backgroundColor: "#81B29A",
  },

  // Tip card
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: "#F4F1DE",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  tipIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#e8f5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    fontFamily: "WorkSansRegular",
    lineHeight: 20,
  },

  // Continue
  continueBtn: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: "#3BBFAD",
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1.5,
    fontFamily: "WorkSansBold",
  },
});