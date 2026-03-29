import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { callGeminiAPI } from "@/api/gemini";
import { TEMPLATE_CONFIGS, ProjectsDisplayMode } from "@/config/templateConfig";
import { stripBulletMarkersFromPolishedText } from "@/utils/polishBulletText";
import CustomLoader from '../../appcomp/CustomLoader';

interface ProjectStepProps {
  data: any;
  addProjects: any;
  updateProjects: any;
  removeProjects: any;
  /** Index in `data.projects` this screen edits (summary / add-another must stay in sync). */
  activeProjectIndex: number;
  onPreview: () => void;
  nextStep: () => void;
  prevStep: () => void;
  step: number;
  totalSteps: number;
}

const ProjectStep: React.FC<ProjectStepProps> = ({
  data,
  addProjects,
  updateProjects,
  removeProjects,
  activeProjectIndex,
  onPreview,
  nextStep,
  prevStep,
  step,
  totalSteps,
}) => {
  const projectExperience = data.projects || [];
  const projectIndex = Math.min(
    Math.max(0, activeProjectIndex),
    Math.max(0, projectExperience.length - 1)
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const projectsMode: ProjectsDisplayMode =
    (TEMPLATE_CONFIGS?.[data.selected_template as string]?.projects?.mode as ProjectsDisplayMode) ??
    "card";
  // Nocard (single form) mode state
  // const [projectsView, setProjectsView] = useState<"summary" | "edit">(
  //   "summary",
  // );
  // const EMPTY_PROJECT = {
  //   title: "",
  //   technologies: "",
  //   description: "",
  //   liveUrl: "",
  // };

  // const isProjectEmpty = (p: any) => {
  //   if (!p) return true;
  //   const t = (p.title || "").trim();
  //   const d = (p.description || "").trim();
  //   const tech = (p.technologies || "").trim();
  //   const url = (p.liveUrl || "").trim();
  //   return !t && !d && !tech && !url;
  // };

  // const visibleEntries: { exp: any; index: number }[] = projectExperience
  //   .map((exp: any, index: number) => ({ exp, index }))
  //   .filter((entry: { exp: any; index: number }) => !isProjectEmpty(entry.exp));

  // Ensure at least one project exists
  React.useEffect(() => {
    if (projectExperience.length === 0) {
      addProjects({ title: "", technologies: "", description: "", liveUrl: "" });
    }
  }, []);





  // const handleEditNoCard = (index: number) => {
  //   setActiveProjectIndex(index);
  //   setProjectsView("edit");
  // };

  // const handleDeleteNoCard = (index: number) => {
  //   setActiveProjectIndex((prev) => (index < prev ? Math.max(0, prev - 1) : prev));
  //   handleRemoveProject(index);
  // };

  // const handleAddAnotherNoCard = () => {
  //   // If the last entry is already empty, just edit it instead of adding more blanks.
  //   if (
  //     projectExperience.length > 0 &&
  //     isProjectEmpty(projectExperience[projectExperience.length - 1])
  //   ) {
  //     setActiveProjectIndex(projectExperience.length - 1);
  //     setProjectsView("edit");
  //     return;
  //   }

  //   addProjects(EMPTY_PROJECT);
  //   setActiveProjectIndex(projectExperience.length); // new index
  //   setProjectsView("edit");
  // };

  const normalizeGeminiBullets = (raw: string): string => {
    const lines = (raw || "")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    // Extract likely bullet lines and normalize to "* ..."
    const bullets = lines
      .map((line) => {
        // Remove bullet markers: "*", "-", "•", numbering, etc.
        const cleaned = line
          .replace(/^(?:[*•-]\s+|\d+\.\s+|\d+\)\s+)+/g, "")
          .replace(/^(?:[*•-])\s*/g, "")
          .trim();
        return cleaned;
      })
      .filter(Boolean);

    const picked = bullets.slice(0, 5);
    return picked.map((b) => `* ${b}`).join("\n");
  };

  const generateSummary = async (index: number) => {
    const proj = projectExperience[index];
    const desc = (proj?.description || "").trim();
    if (!proj || !(proj.title || "").trim() || desc.length <= 5) {
      Alert.alert("Not enough content", "Please write at least a few words about your project before polishing.", [{ text: "OK" }]);
      return;
    }
    setIsGenerating(true);
    setGeneratingIndex(index);
    try {
      const prompt = `Polish the following project description by improving grammar, punctuation, readability, and incorporating relevant technical terms. 
Do not shorten or expand the overall meaning. Return strictly 4-5 bullet points.
Rules:
1) Return ONLY bullet lines (no extra text).
2) Each bullet line MUST START with "* ".
3) Provide between 4 and 5 bullets (prefer 5).

Project title: "${proj.title}"
Original description:
${desc}`;
      const result = await callGeminiAPI(prompt);
      const normalized = normalizeGeminiBullets(result);
      const display = stripBulletMarkersFromPolishedText(normalized || result);
      updateProjects(index, "description", display);
    } catch {
      Alert.alert("Error", "Failed to polish the description. Please try again.", [{ text: "OK" }]);
    } finally {
      setIsGenerating(false);
      setGeneratingIndex(null);
    }
  };

  const renderField = (
    index: number,
    key: string,
    label: string,
    placeholder: string,
    multiline = false,
    iconName?: string
  ) => {
    const fieldId = `${index}-${key}`;
    const value = projectExperience[index]?.[key] || "";
    const isFocused = focusedField === fieldId;

    return (
      <View style={styles.fieldContainer}>
        {(value || isFocused) && (
          <Text style={styles.floatingLabel}>{label.toUpperCase()}</Text>
        )}
        <View style={styles.fieldRow}>
          {iconName && (
            <Ionicons
              name={iconName as any}
              size={18}
              color={isFocused ? "#3BBFAD" : value ? "#3D405B" : "#bbb"}
              style={{ marginRight: 8, marginTop: multiline ? 6 : 0 }}
            />
          )}
                  
          <TextInput
            style={[
              styles.fieldInput,
              multiline && styles.multilineInput,
            ]}
            placeholder={isFocused ? placeholder : label}
            placeholderTextColor="#bbb"
            value={value}
            multiline={multiline}
            textAlignVertical={multiline ? "top" : "center"}
            onFocus={() => setFocusedField(fieldId)}
            onBlur={() => setFocusedField(null)}
            onChangeText={(val) => updateProjects(index, key, val)}
          />
          {value && !multiline && (
            <Ionicons name="checkmark-circle" size={18} color="#3BBFAD" />
          )}
        </View>
        {/* Full-width underline for non-multiline, top+bottom for multiline */}
        {!multiline && (
          <View style={[styles.underline, isFocused && styles.underlineFocused]} />
        )}
      </View>
    );
  };

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
            <Text style={styles.navTitle}>PROJECTS</Text>
          </View>
          <TouchableOpacity style={styles.rightBtn} onPress={onPreview}>
            <Text style={styles.previewText}>Preview</Text>
          </TouchableOpacity>
        </View>
        {/* Heading */}
        <View style={styles.headingBlock}>
          <Text style={styles.mainHeading}>Mention your best Projects</Text>
          <Text style={styles.subHeading}>
            Showcase your best work — include live links and tech stack for maximum impact
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.scrollContentnoCard}
        >

          {/* ── Project Cards ── */}
          {
            <>

              {

                renderField(projectIndex, "title", "Project Title", "title", false, "folder-outline")
              }
              {
                projectsMode === "card" && (

                  renderField(projectIndex, "technologies", "Tech Stack", "e.g. React Native, Node.js, MongoDB", false, "code-slash-outline")

                )
              }
              {

                renderField(projectIndex, "liveUrl", "Live Link", "Project url", false, "globe-outline")
              }
              {/* ── Description — full width top/bottom borders ── */}
              {

                renderField(projectIndex, "description", "Describe you project", "Describe you project ", true, "")
              }
              {/* ── AI Polish Button ── */}
              <View style={projectsMode === "nocard" ? styles.aiSectionNoCard : styles.aiSection}>
                <TouchableOpacity
                  style={[
                    styles.aiBtn,
                    isGenerating && generatingIndex === projectIndex && styles.aiBtnLoading,
                  ]}
                  onPress={() => generateSummary(projectIndex)}
                  disabled={isGenerating && generatingIndex === projectIndex}
                  activeOpacity={0.85}
                >
                  {isGenerating && generatingIndex === projectIndex ? (
                    <View style={styles.aiBtnInner}>
                      <CustomLoader size={18} color="#3BBFAD" bars={12} />
                      <Text style={styles.aiBtnText}>Polishing description...</Text>
                    </View>
                  ) : (
                    <View style={styles.aiBtnInner}>
                      <View style={styles.sparkleBox}>
                        <Text style={styles.sparkle}>✦</Text>
                      </View>
                      <View>
                        <Text style={styles.aiBtnLabel}>Polish with AI</Text>
                        <Text style={styles.aiBtnSub}>Improve grammar & impact</Text>
                      </View>
                      <Ionicons
                        name="arrow-forward"
                        size={16}
                        color="#3BBFAD"
                        style={{ marginLeft: "auto" }}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </>

          }


          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ── Continue ── */}
        <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ProjectStep;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

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
  stepText: { fontSize: 11, color: "#3D405B", fontFamily: "WorkSansRegular" },
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

  scrollContentnoCard: { paddingHorizontal: 20, paddingBottom: 120 },
  scrollContent: { paddingBottom: 20 },

  // Heading
  headingBlock: { paddingHorizontal: 20, marginBottom: 20 },
  headingBlockNoCard: { marginBottom: 20 },
  mainHeading: {
    marginTop: 10,
    fontSize: 28,
    color: "#3D405B",
    fontFamily: "PlayfairDisplayBold",
    lineHeight: 36,
    maxWidth: 300,
  },
  subHeading: {
    marginTop: 6,
    fontSize: 15,
    color: "#666",
    fontFamily: "WorkSansRegular",
    marginBottom: 8,
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

  // Project Card
  projectCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F4F1DE",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  projectBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#3BBFAD",
    justifyContent: "center",
    alignItems: "center",
  },
  projectBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "WorkSansBold",
  },
  projectLabel: {
    fontSize: 10,
    fontFamily: "WorkSansBold",
    color: "#888",
    letterSpacing: 1,
  },
  projectTitlePreview: {
    fontSize: 14,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
    maxWidth: 200,
  },
  projectTitleEmpty: {
    fontSize: 13,
    fontFamily: "WorkSansRegular",
    color: "#bbb",
    fontStyle: "italic",
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#fff5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fdd",
  },
  cardDivider: { height: 1, backgroundColor: "#eee" },

  cardBody: { paddingHorizontal: 16, paddingTop: 16 },

  // Fields
  fieldContainer: { marginBottom: 16 },
  floatingLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#3D405B",
    letterSpacing: 0.5,
    marginBottom: 2,
    fontFamily: "WorkSansSemiBold",
  },
  fieldRow: { flexDirection: "row", alignItems: "center" },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: "#3D405B",
    paddingVertical: 6,
    fontFamily: "WorkSansRegular",
  },
  multilineInput: {     
    minHeight: 160,
    height:80,
    fontSize: 15,
    fontFamily: "WorkSansRegular",
    color: "#3D405B",
    lineHeight: 26,
    // paddingHorizontal: 20,
    paddingTop: 12,
    // paddingBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    marginBottom: 0,
  },
  underline: { height: 1, backgroundColor: "#eee", marginTop: 4 },
  underlineFocused: { height: 1.5, backgroundColor: "#3BBFAD" },

  // Description — full width
  descriptionWrapper: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    marginTop: 4,
  },
  descriptionLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#3D405B",
    letterSpacing: 0.8,
    marginBottom: 6,
    fontFamily: "WorkSansSemiBold",
  },
  descriptionInput: {
    minHeight: 120,
    fontSize: 14,
    fontFamily: "WorkSansRegular",
    color: "#3D405B",
    lineHeight: 24,
    paddingBottom: 12,
  },

  // AI Button
  aiSection: { padding: 16 },
  aiSectionNoCard: { paddingTop: 20 },
  aiBtn: {
    borderWidth: 1.5,
    borderColor: "#3BBFAD",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  aiBtnLoading: { backgroundColor: "#f0faf8", borderColor: "#81B29A" },
  aiBtnInner: { flexDirection: "row", alignItems: "center", gap: 12 },
  sparkleBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#e8f5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  sparkle: { fontSize: 16, color: "#3BBFAD" },
  aiBtnLabel: { fontSize: 14, fontFamily: "WorkSansSemiBold", color: "#3D405B" },
  aiBtnSub: { fontSize: 11, fontFamily: "WorkSansRegular", color: "#888", marginTop: 1 },
  aiBtnText: { fontSize: 14, fontFamily: "WorkSansRegular", color: "#3D405B", marginLeft: 8 },

  // Add button
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    // marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#3BBFAD",
    borderStyle: "dashed",
    borderRadius: 14,
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#f9fffe",
  },
  addBtnIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e8f5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: { fontSize: 14, color: "#3BBFAD", fontFamily: "WorkSansSemiBold" },

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