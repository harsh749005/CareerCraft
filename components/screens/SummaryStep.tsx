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
import { callGeminiAPI } from "@/api/gemini";
import CustomLoader from "../appcomp/CustomLoader";
interface SummaryStepProps {
  data: any;
  summary: any;
  updateSummary: any;
  nextStep: () => void;
  prevStep: () => void;
}
const SummaryStep: React.FC<SummaryStepProps> = ({
  data,
  summary,
  updateSummary,
  nextStep,
  prevStep,
}) => {
  const { projects, work_experience, education, skills } = data;
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    // for ${
    //       personal_info.full_name
    //     }.
    try {
      if (summary.length === 0) {
        const prompt = `Write a professional resume summary 
          Here's their work experience: ${JSON.stringify(work_experience.year)}
          Here's their education: ${JSON.stringify(education.degree)}
          Here are their skills: ${JSON.stringify(
            skills.languages
          )}${JSON.stringify(skills.frameworks)}${JSON.stringify(
          skills.tools
        )}${JSON.stringify(skills.databases)}
          Guidelines:
- Return strictly 3 clear and concise bullet points.  
- Do not add headings or extra explanations or double astrisk.  
- Use strong, impactful action verbs (e.g., "engineered", "optimized", "led", "developed").  
- Highlight achievements, problem-solving ability, and technical expertise.  
- Keep it professional and results-oriented.  
- Keep the meaning true to the provided details, but polish language for maximum impact. 
          `;
        const result = await callGeminiAPI(prompt);
        updateSummary(result);
      } else if (summary.length > 5) {
        const prompt = `Polish the following work experience description by improving grammar, punctuation, readability, and incorporating relevant technical terms where appropriate. 
Do not shorten , no headings or  expand the overall meaning beyond the original context. 
Return the polished version strictly as 3 clear and concise bullet points:

"${summary}"`;
        const result = await callGeminiAPI(prompt);
        updateSummary(result);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header Section */}
          <View style={styles.header}>
            {/* <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>Step 3 of 4</Text>
            </View> */}
            <Text style={styles.title}>Professional Summary</Text>
            <Text style={styles.subtitle}>
              Create a compelling summary that highlights your key strengths,
              experience, and career objectives
            </Text>
          </View>

          {/* Main Content */}
          <View style={styles.contentSection}>
            {/* Input Section */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Your Professional Summary</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    summary.length > 0 && styles.inputFilled,
                  ]}
                  placeholder="Write a compelling professional summary that showcases your expertise, achievements, and career goals..."
                  placeholderTextColor="#a0a0a0"
                  value={summary}
                  onChangeText={updateSummary}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                {summary.length > 0 && (
                  <Text style={styles.characterCount}>
                    {summary.length} characters
                  </Text>
                )}
              </View>
            </View>

            {/* AI Generate Button */}
            <TouchableOpacity
              onPress={generateSummary}
              style={[
                styles.generateButton,
                isGenerating && styles.generateButtonLoading,
              ]}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <View style={styles.loadingContent}>
                  <CustomLoader size={20} color="#ffffff" bars={12} />
                  <Text style={styles.generateButtonTextLoading}>
                    AI is crafting your summary...
                  </Text>
                </View>
              ) : (
                <View style={styles.generateContent}>
                  <Text style={styles.generateIcon}>✨</Text>
                  <Text style={styles.generateButtonText}>
                    {summary.length === 0
                      ? "Generate AI Summary"
                      : "Polish with AI"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tips Section */}
            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
              <View style={styles.tipsList}>
                <Text style={styles.tipItem}>
                  • Based on your previous form details AI can generate summary
                </Text>
                <Text style={styles.tipItem}>
                  • Keep it concise (2-3 sentences)
                </Text>
                <Text style={styles.tipItem}>
                  • Highlight your most relevant experience
                </Text>
                <Text style={styles.tipItem}>
                  • Include key skills and achievements
                </Text>
                <Text style={styles.tipItem}>
                  • Tailor it to your target role
                </Text>
              </View>
            </View>

            {/* Preview Section */}
            {summary.length > 0 && (
              <View style={styles.previewSection}>
                <Text style={styles.previewTitle}>Preview</Text>
                <View style={styles.previewContainer}>
                  <Text style={styles.previewText}>{summary}</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={prevStep}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
            <Text style={styles.nextButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flex: 1,
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
  contentSection: {
    // paddingHorizontal: 24,
    paddingBottom: 120,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 18,
    fontFamily: "WorkSansMedium",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    borderWidth: 2,
    borderColor: "#e6e6e6",
    // borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: "WorkSansRegular",
    color: "#1a1a1a",
    minHeight: 120,
    backgroundColor: "#fafafa",
    lineHeight: 24,
  },
  inputFilled: {
    borderColor: "#007AFF",
    backgroundColor: "#ffffff",
  },
  characterCount: {
    position: "absolute",
    bottom: 8,
    right: 12,
    fontSize: 12,
    color: "#999999",
    fontFamily: "WorkSansRegular",
  },
  generateButton: {
    backgroundColor: "#007AFF",
    // borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 32,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonLoading: {
    backgroundColor: "#5eb3ff",
  },
  generateContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  generateIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  generateButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "WorkSansMedium",
    textAlign: "center",
  },
  generateButtonTextLoading: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "WorkSansRegular",
    textAlign: "center",
    marginLeft: 12,
  },
  tipsSection: {
    backgroundColor: "#f8f9fa",
    // borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: "WorkSansMedium",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    fontFamily: "WorkSansRegular",
    color: "#666666",
    lineHeight: 20,
  },
  previewSection: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontFamily: "WorkSansMedium",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  previewContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e6e6e6",
    // borderRadius: 12,
    padding: 16,
  },
  previewText: {
    fontSize: 15,
    fontFamily: "WorkSansRegular",
    color: "#333333",
    lineHeight: 22,
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

export default SummaryStep;
