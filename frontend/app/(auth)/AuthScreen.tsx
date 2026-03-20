import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGoogleAuth } from "../../utils/usegoogleAuth";
import { useRouter } from "expo-router";

interface AuthScreenProps {
  onAuthSuccess: () => void;
  onBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, onBack }) => {
  // const { request, response, promptAsync } = useGoogleAuth();
  const router = useRouter();
  const { signInWithGoogle } = useGoogleAuth();
  // useEffect(() => {
    // console.log("Response:", response);

  //   if (response?.type === "success") {
  //     console.log("Login Success ✅");

  //     // 👉 navigate after login
  //     router.replace("/(root)");
  //   }
  // }, [response]);
  // console.log("Redirect URI used:", request?.redirectUri);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"register" | "login">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isEmailValid = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 6;
  const isConfirmValid = mode === "login" || confirmPassword === password;
  const canSubmit = isEmailValid && isPasswordValid && isConfirmValid;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    // Extra check for register mode
    if (mode === "register" && confirmPassword !== password) {
      setError("Passwords don't match.");
      return;
    }

    setIsLoading(true);
    setError("");

    // const result =
    //   mode === "register"
    //     ? await registerWithEmail(email, password)
    //     : await loginWithEmail(email, password);

    // setIsLoading(false);

    // if (result.success) {
    //   onAuthSuccess();
    // } else {
    //   setError(result.error || "Something went wrong.");
    // }
  };

  const handleGoogle = async () => {
    try {
      setError("");
      setIsLoading(true);
      const result = await signInWithGoogle();
      if (result.success) {
        router.replace("/(root)");
      } else {
        setError("Google sign in failed. Please try again.");
      }
    } catch (e) {
      setError("Google sign in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />

        {/* ── Navbar ── */}
        <View style={styles.navbar}>
          <TouchableOpacity onPress={onBack} style={styles.leftIcon}>
            <Ionicons name="arrow-back" size={22} color="#3D405B" />
          </TouchableOpacity>
          <View style={styles.centerContent}>
            <Text style={styles.navTitle}>
              {mode === "register" ? "REGISTRATION" : "LOGIN"}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Heading */}
          <View style={styles.headingBlock}>
            <Text style={styles.mainHeading}>
              {mode === "register"
                ? "Create an account to access your CVs from anywhere"
                : "Welcome back! Sign in to your account"}
            </Text>
            <Text style={styles.subHeading}>
              {mode === "register"
                ? "Your resumes are saved securely in the cloud"
                : "Continue where you left off"}
            </Text>
          </View>

          {/* Context banner */}
          <View style={styles.contextBanner}>
            <View style={styles.contextIconBox}>
              <Ionicons name="document-text-outline" size={18} color="#3BBFAD" />
            </View>
            <Text style={styles.contextText}>
              Sign in to export your resume as PDF
            </Text>
          </View>

          {/* ✅ Error banner */}
          {error.length > 0 && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={15} color="#e07070" />
              <Text style={styles.errorBannerText}>{error}</Text>
              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name="close" size={15} color="#e07070" />
              </TouchableOpacity>
            </View>
          )}

          {/* Google Button */}
          <TouchableOpacity
            // style={[styles.googleBtn, (!request || isLoading) && { opacity: 0.6 }]}
            style={[styles.googleBtn, ( isLoading) && { opacity: 0.6 }]}
            onPress={handleGoogle}
            // disabled={!request || isLoading}
            disabled={ isLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>
              {mode === "register" ? "or sign up with email" : "or sign in with email"}
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Fields */}
          <View style={styles.fieldsBlock}>

            {/* Email */}
            <View style={styles.fieldContainer}>
              {(email || focusedField === "email") && (
                <Text style={styles.floatingLabel}>EMAIL ADDRESS</Text>
              )}
              <View style={styles.fieldRow}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={focusedField === "email" ? "#3BBFAD" : email ? "#3D405B" : "#bbb"}
                  style={styles.fieldIcon}
                />
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Email address"
                  placeholderTextColor="#bbb"
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  onChangeText={(val) => { setEmail(val); setError(""); }}
                />
                {isEmailValid && (
                  <Ionicons name="checkmark-circle" size={20} color="#3BBFAD" />
                )}
              </View>
              <View style={[
                styles.underline,
                focusedField === "email" && styles.underlineFocused,
                isEmailValid && focusedField !== "email" && styles.underlineFilled,
              ]} />
            </View>

            {/* Password */}
            <View style={styles.fieldContainer}>
              {(password || focusedField === "password") && (
                <Text style={styles.floatingLabel}>PASSWORD</Text>
              )}
              <View style={styles.fieldRow}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={focusedField === "password" ? "#3BBFAD" : password ? "#3D405B" : "#bbb"}
                  style={styles.fieldIcon}
                />
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Password (min 6 characters)"
                  placeholderTextColor="#bbb"
                  value={password}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  onChangeText={(val) => { setPassword(val); setError(""); }}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#aaa"
                  />
                </TouchableOpacity>
              </View>
              <View style={[
                styles.underline,
                focusedField === "password" && styles.underlineFocused,
                isPasswordValid && focusedField !== "password" && styles.underlineFilled,
              ]} />

              {/* Password strength */}
              {password.length > 0 && (
                <View style={styles.strengthRow}>
                  {[1, 2, 3, 4].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.strengthBar,
                        password.length >= i * 2 && {
                          backgroundColor:
                            password.length < 4 ? "#e07070" :
                            password.length < 6 ? "#f0a04e" : "#3BBFAD",
                        },
                      ]}
                    />
                  ))}
                  <Text style={styles.strengthText}>
                    {password.length < 4 ? "Weak" : password.length < 6 ? "Fair" : "Strong"}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirm Password — register only */}
            {mode === "register" && (
              <View style={styles.fieldContainer}>
                {(confirmPassword || focusedField === "confirm") && (
                  <Text style={styles.floatingLabel}>CONFIRM PASSWORD</Text>
                )}
                <View style={styles.fieldRow}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color={focusedField === "confirm" ? "#3BBFAD" : confirmPassword ? "#3D405B" : "#bbb"}
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="Confirm your password"
                    placeholderTextColor="#bbb"
                    value={confirmPassword}
                    secureTextEntry={!showConfirm}
                    onFocus={() => setFocusedField("confirm")}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={(val) => { setConfirmPassword(val); setError(""); }}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm((v) => !v)}>
                    <Ionicons
                      name={showConfirm ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color="#aaa"
                    />
                  </TouchableOpacity>
                </View>
                <View style={[
                  styles.underline,
                  focusedField === "confirm" && styles.underlineFocused,
                  confirmPassword && confirmPassword === password && styles.underlineFilled,
                ]} />
                {confirmPassword.length > 0 && confirmPassword !== password && (
                  <Text style={styles.errorText}>{`Passwords don't match`}</Text>
                )}
              </View>
            )}
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By continuing you agree to our{" "}
            <Text style={styles.termsLink}>Terms</Text>
            {" · "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
            {" · "}
            <Text style={styles.termsLink}>Contact us</Text>
          </Text>

          {/* Mode Switch */}
          <TouchableOpacity
            style={styles.switchMode}
            onPress={() => {
              setMode(mode === "register" ? "login" : "register");
              setError("");
              setConfirmPassword("");
            }}
          >
            <Text style={styles.switchModeText}>
              {mode === "register"
                ? "I already have an account"
                : "Create a new account"}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, (!canSubmit || isLoading) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || isLoading}
          activeOpacity={0.88}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.submitBtnText}>
                {mode === "register" ? "Save & Continue" : "Sign In"}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  navbar: {
    height: 56,
    backgroundColor: "#F4F1DE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  leftIcon:      { position: "absolute", left: 20 },
  centerContent: { flex: 1, alignItems: "center" },
  navTitle: {
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#3D405B",
    fontFamily: "WorkSansBold",
  },

  scrollContent: { paddingBottom: 20 },

  headingBlock: {
    paddingHorizontal: 24,
    paddingTop: 28,
    marginBottom: 20,
    alignItems: "center",
  },
  mainHeading: {
    fontSize: 26,
    color: "#3D405B",
    fontFamily: "PlayfairDisplayBold",
    lineHeight: 34,
    textAlign: "center",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 14,
    color: "#888",
    fontFamily: "WorkSansRegular",
    textAlign: "center",
    lineHeight: 21,
  },

  contextBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#e8f5f2",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#c8e8e0",
  },
  contextIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  contextText: {
    flex: 1,
    fontSize: 13,
    color: "#3D405B",
    fontFamily: "WorkSansSemiBold",
  },

  // ✅ Error banner
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#fff5f5",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#fdd",
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: "#e07070",
    fontFamily: "WorkSansRegular",
  },

  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    gap: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  googleG: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4285F4",
    fontFamily: "WorkSansBold",
  },
  googleText: {
    fontSize: 15,
    color: "#3D405B",
    fontFamily: "WorkSansSemiBold",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#eee" },
  dividerText: { fontSize: 12, color: "#aaa", fontFamily: "WorkSansRegular" },

  fieldsBlock:    { paddingHorizontal: 20 },
  fieldContainer: { marginBottom: 20 },
  floatingLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#3D405B",
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily: "WorkSansSemiBold",
  },
  fieldRow:   { flexDirection: "row", alignItems: "center" },
  fieldIcon:  { marginRight: 10 },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: "#3D405B",
    paddingVertical: 8,
    fontFamily: "WorkSansRegular",
  },
  underline:        { height: 1,   backgroundColor: "#eee", marginTop: 4 },
  underlineFocused: { height: 1.5, backgroundColor: "#3BBFAD" },
  underlineFilled:  { backgroundColor: "#81B29A" },

  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#eee",
  },
  strengthText: {
    fontSize: 11,
    color: "#888",
    fontFamily: "WorkSansRegular",
    marginLeft: 4,
    minWidth: 40,
  },
  errorText: {
    fontSize: 12,
    color: "#e07070",
    fontFamily: "WorkSansRegular",
    marginTop: 4,
  },

  termsText: {
    fontSize: 12,
    color: "#aaa",
    fontFamily: "WorkSansRegular",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    lineHeight: 20,
  },
  termsLink: { color: "#3BBFAD", fontFamily: "WorkSansSemiBold" },

  switchMode:     { alignItems: "center", paddingVertical: 8 },
  switchModeText: {
    fontSize: 15,
    color: "#3D405B",
    fontFamily: "WorkSansSemiBold",
    textDecorationLine: "underline",
  },

  submitBtn: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    flexDirection: "row",
    backgroundColor: "#3BBFAD",
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: { backgroundColor: "#ccc" },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: "WorkSansBold",
  },
});