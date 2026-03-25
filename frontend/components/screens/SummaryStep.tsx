import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { callGeminiAPI } from "@/api/gemini";
import CustomLoader from "../appcomp/CustomLoader";

interface SummaryStepProps {
  data: any;
  summary: any;
  updateSummary: any;
  nextStep: () => void;
  prevStep: () => void;
  step: number;
  totalSteps: number;
}

const SummaryStep: React.FC<SummaryStepProps> = ({
  data,
  summary,
  updateSummary,
  nextStep,
  prevStep,
  step,
  totalSteps,
}) => {
  const { work_experience, education, skills } = data;
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      if (summary.length === 0) {
        const prompt = `Write a professional resume summary 
          Here's their work experience: ${JSON.stringify(work_experience.year)}
          Here's their education: ${JSON.stringify(education.degree)}
          Here are their skills: ${JSON.stringify(skills.languages)}${JSON.stringify(skills.frameworks)}${JSON.stringify(skills.tools)}${JSON.stringify(skills.databases)}
          Guidelines:
- Return strictly 3 clear and concise bullet points.  
- Do not add headings or extra explanations or double asterisk.  
- Use strong, impactful action verbs.  
- Highlight achievements, problem-solving ability, and technical expertise.  
- Keep it professional and results-oriented.`;
        const result = await callGeminiAPI(prompt);
        updateSummary(result);
      } else if (summary.length > 5) {
        const prompt = `Polish the following resume summary. Do not shorten or expand beyond original context. Return strictly 3 clear bullet points:\n\n"${summary}"`;
        const result = await callGeminiAPI(prompt);
        updateSummary(result);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isEmpty = summary.length === 0;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />
      <View style={styles.container}>

        {/* ── Navbar ── */}
        <View style={styles.navbar}>
          <TouchableOpacity onPress={prevStep} style={styles.leftIcon}>
            <Ionicons name="arrow-back" size={22} color="#3D405B" />
          </TouchableOpacity>
          <View style={styles.centerContent}>
            <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
            <Text style={styles.navTitle}>SUMMARY</Text>
          </View>
          <TouchableOpacity style={styles.rightBtn}>
            <Text style={styles.previewTextbtn}>Preview</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Heading */}
          <View style={styles.headingBlock}>
            <Text style={styles.mainHeading}>Professional Summary</Text>
            <Text style={styles.subHeading}>
              A strong summary helps recruiters understand your value at a glance
            </Text>
          </View>

          {/* ── Textarea — full width top/bottom border ── */}
          <View style={styles.textAreaWrapper}>
            {/* Character count top right */}
            {summary.length > 0 && (
              <Text style={styles.charCount}>{summary.length} characters</Text>
            )}
            <TextInput
              style={styles.textArea}
              placeholder={
                "Write your professional summary here...\n\n• Highlight your key skills\n• Mention years of experience\n• State your career objective"
              }
              placeholderTextColor="#bbb"
              value={summary}
              onChangeText={updateSummary}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* ── AI Button ── */}
          <View style={styles.aiSection}>
            <TouchableOpacity
              onPress={generateSummary}
              style={[styles.aiBtn, isGenerating && styles.aiBtnLoading]}
              disabled={isGenerating}
              activeOpacity={0.85}
            >
              {isGenerating ? (
                <View style={styles.aiBtnInner}>
                  <CustomLoader size={18} color="#fff" bars={12} />
                  <Text style={styles.aiBtnText}>Crafting your summary...</Text>
                </View>
              ) : (
                <View style={styles.aiBtnInner}>
                  <View style={styles.sparkleBox}>
                    <Text style={styles.sparkle}>✦</Text>
                  </View>
                  <View>
                    <Text style={styles.aiBtnLabel}>
                      {isEmpty ? "Generate with AI" : "Polish with AI"}
                    </Text>
                    <Text style={styles.aiBtnSub}>
                      {isEmpty
                        ? "Based on your resume data"
                        : "Improve grammar & impact"}
                    </Text>
                  </View>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#3BBFAD"
                    style={{ marginLeft: "auto" }}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ── Tips ── */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb-outline" size={16} color="#3BBFAD" />
              <Text style={styles.tipsTitle}>Pro Tips</Text>
            </View>
            {[
              "AI generates summary based on your previous form details",
              "Keep it concise — 2 to 3 sentences works best",
              "Use strong action verbs like led, built, optimized",
              "Tailor it to your target role for best results",
            ].map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* ── Preview ── */}
          {summary.length > 0 && (
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <Ionicons name="eye-outline" size={16} color="#3D405B" />
                <Text style={styles.previewTitle}>Preview</Text>
              </View>
              <Text style={styles.previewText}>{summary}</Text>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ── Continue Button ── */}
        <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SummaryStep;

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
  previewTextbtn: {
    color: "#3BBFAD",
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
  },

  scrollContent: {
    paddingBottom: 20,
  },

  // Heading
  headingBlock: {
    paddingHorizontal: 20,
    paddingTop: 24,
    marginBottom: 24,
  },
  mainHeading: {
    fontSize: 30,
    color: "#3D405B",
    fontFamily: "PlayfairDisplayBold",
    lineHeight: 38,
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 14,
    color: "#888",
    fontFamily: "WorkSansRegular",
    lineHeight: 22,
  },

  // ── Textarea: full-width top/bottom borders ──
  textAreaWrapper: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    marginBottom: 20,
  },
  charCount: {
    textAlign: "right",
    fontSize: 11,
    color: "#bbb",
    fontFamily: "WorkSansRegular",
    paddingRight: 14,
    paddingTop: 8,
  },
  textArea: {
    minHeight: 160,
    fontSize: 15,
    fontFamily: "WorkSansRegular",
    color: "#3D405B",
    lineHeight: 26,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },

  // ── AI Button ──
  aiSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  aiBtn: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#3BBFAD",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  aiBtnLoading: {
    backgroundColor: "#f0faf8",
    borderColor: "#81B29A",
  },
  aiBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sparkleBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#e8f5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  sparkle: {
    fontSize: 18,
    color: "#3BBFAD",
  },
  aiBtnLabel: {
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  aiBtnSub: {
    fontSize: 12,
    fontFamily: "WorkSansRegular",
    color: "#888",
    marginTop: 2,
  },
  aiBtnText: {
    fontSize: 15,
    fontFamily: "WorkSansRegular",
    color: "#3D405B",
    marginLeft: 10,
  },

  // ── Tips ──
  tipsCard: {
    marginHorizontal: 20,
    backgroundColor: "#F4F1DE",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 13,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
    letterSpacing: 0.3,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  tipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#3BBFAD",
    marginTop: 7,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "WorkSansRegular",
    color: "#666",
    lineHeight: 20,
  },

  // ── Preview ──
  previewCard: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 16,
    backgroundColor: "#fff",
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  previewTitle: {
    fontSize: 13,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  previewText: {
    fontSize: 14,
    fontFamily: "WorkSansRegular",
    color: "#555",
    lineHeight: 24,
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