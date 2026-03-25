import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OtherLinksProps {
  data: any;
  updateOtherLinks: any;
  nextStep: () => void;
  prevStep: () => void;
  step: number;
  totalSteps: number;
}

const OtherLinks: React.FC<OtherLinksProps> = ({
  data,
  updateOtherLinks,
  nextStep,
  prevStep,
  step,
  totalSteps,
}) => {
  const dataLink = data.otherLinks || {};
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const links = [
    {
      key: "leetcode",
      label: "LeetCode",
      placeholder: "https://leetcode.com/username",
      icon: "code-slash-outline",
    },
    {
      key: "linkedIn",
      label: "LinkedIn",
      placeholder: "https://linkedin.com/in/username",
      icon: "logo-linkedin",
    },
    {
      key: "github",
      label: "GitHub",
      placeholder: "https://github.com/username",
      icon: "logo-github",
    },
    {
      key: "portfolio",
      label: "Portfolio",
      placeholder: "https://yourportfolio.com",
      icon: "globe-outline",
    },
    {
      key: "twitter",
      label: "Twitter / X",
      placeholder: "https://twitter.com/username",
      icon: "logo-twitter",
    },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />
      <View style={styles.container}>

        {/* Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity onPress={prevStep} style={styles.leftIcon}>
            <Ionicons name="arrow-back" size={22} color="#3D405B" />
          </TouchableOpacity>
          <View style={styles.centerContent}>
            <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
            <Text style={styles.navTitle}>OTHER LINKS</Text>
          </View>
          <TouchableOpacity style={styles.rightBtn}>
            <Text style={styles.previewText}>Preview</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Heading */}
          <Text style={styles.mainHeading}>Add your online presence</Text>
          <Text style={styles.subHeading}>
            Include links to your professional profiles and portfolio to stand out
          </Text>

          {/* Link Fields */}
          {links.map(({ key, label, placeholder, icon }) => {
            const value = dataLink[key] || "";
            const isFocused = focusedField === key;

            return (
              <View key={key} style={styles.fieldContainer}>
                {/* Floating Label */}
                {(value || isFocused) && (
                  <Text style={styles.floatingLabel}>{label.toUpperCase()}</Text>
                )}

                <View style={styles.fieldRow}>
                  {/* Left Icon */}
                  <Ionicons
                    name={icon as any}
                    size={20}
                    color={isFocused ? "#3BBFAD" : value ? "#3D405B" : "#bbb"}
                    style={styles.leftFieldIcon}
                  />

                  {/* Input */}
                  <TextInput
                    style={[
                      styles.input,
                      isFocused && styles.inputFocused,
                    ]}
                    placeholder={isFocused ? placeholder : label}
                    placeholderTextColor="#aaa"
                    keyboardType="url"
                    autoCapitalize="none"
                    value={value}
                    onFocus={() => setFocusedField(key)}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={(val) => updateOtherLinks(key, val)}
                  />

                  {/* ✅ Delete / Clear icon */}
                  {value ? (
                    <TouchableOpacity
                      onPress={() => updateOtherLinks(key, "")}
                      style={styles.clearBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="trash-outline" size={18} color="#e07070" />
                    </TouchableOpacity>
                  ) : (
                    // Green tick when valid URL
                    value.startsWith("http") && (
                      <Ionicons name="checkmark-circle" size={20} color="#3BBFAD" />
                    )
                  )}
                </View>

                {/* Underline */}
                <View
                  style={[
                    styles.underline,
                    isFocused && styles.underlineFocused,
                    value && !isFocused && styles.underlineFilled,
                  ]}
                />
              </View>
            );
          })}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default OtherLinks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Navbar
  navbar: {
    height: 56,
    backgroundColor: "#F4F1DE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  leftIcon: { position: "absolute", left: 20 },
  rightBtn: { position: "absolute", right: 20 },
  centerContent: { flex: 1, alignItems: "center" },
  stepText: {
    fontSize: 11,
    color: "#3D405B",
    fontFamily: "WorkSansRegular",
  },
  navTitle: {
    fontSize: 14,
    letterSpacing: 1,
    color: "#3D405B",
    fontFamily: "WorkSansBold",
  },
  previewText: {
    color: "#3BBFAD",
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Heading
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
    marginBottom: 28,
  },

  // Fields
  fieldContainer: {
    marginBottom: 24,
  },
  floatingLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#3D405B",
    letterSpacing: 0.5,
    marginBottom: 2,
    fontFamily: "WorkSansSemiBold",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftFieldIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#3D405B",
    paddingVertical: 8,
    fontFamily: "WorkSansRegular",
  },
  inputFocused: {
    color: "#3D405B",
  },
  clearBtn: {
    marginLeft: 8,
  },
  underline: {
    height: 1,
    backgroundColor: "#ddd",
    marginTop: 4,
  },
  underlineFocused: {
    height: 1.5,
    backgroundColor: "#3BBFAD",
  },
  underlineFilled: {
    backgroundColor: "#81B29A",
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