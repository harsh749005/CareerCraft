import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomLoader from "../appcomp/CustomLoader";
import { generatePDF } from "../generator/GeneratePDF";
import AuthScreen from "../../app/(auth)/AuthScreen";
import { TEMPLATE_CONFIGS } from "@/config/templateConfig";
import { useAuth } from "@clerk/clerk-expo";

interface ReviewStepProps {
  data: any;
  prevStep: () => void;
  goToStep: (step: number) => void;
  step: number;
  totalSteps: number;
}

const STEP_MAP = {
  personal: 3,
  education: 4,
  skills: 5,
  work: 10,
  workDesc: 4,  
  projects: 7,
  summary: 2,
  links: 11,
};

const ReviewStep: React.FC<ReviewStepProps> = ({
  data,
  prevStep,
  goToStep,
  step,
  totalSteps,
}) => {
  const { isSignedIn } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleSubmit = async () => {
    if (!isSignedIn) {
      setShowAuth(true);
      return;
    }
    generate();
  };

  const generate = async () => {
    setIsGenerating(true);
    try {
      setTimeout(async () => {
        console.log("Final Form Data:\n", JSON.stringify(data, null, 2));
        await generatePDF(data);
        setIsGenerating(false);
      }, 3000);
    } catch (err) {
      setIsGenerating(false);
      console.error("Error generating PDF:", err);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    generate();
  };

  if (showAuth) {
    return (
      <AuthScreen
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setShowAuth(false)}
      />
    );
  }

  // ── Section wrapper ──
  const Section = ({
    icon,
    title,
    stepKey,
    children,
  }: {
    icon: string;
    title: string;
    stepKey: keyof typeof STEP_MAP;
    children: React.ReactNode;
  }) => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <View style={styles.sectionIconBox}>
            <Ionicons name={icon as any} size={16} color="#3BBFAD" />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => goToStep(STEP_MAP[stepKey])}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="pencil-outline" size={13} color="#3BBFAD" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionDivider} />
      {children}
    </View>
  );

  const InfoRow = ({
    label,
    value,
    column = false,
  }: {
    label: string;
    value: string;
    column?: boolean;
  }) => (
    <View style={[styles.infoRow, column && { flexDirection: "column" }]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, column && { marginTop: 4 }]}>
        {value || "—"}
      </Text>
    </View>
  );

  // ── Skills rendering ──────────────────────────────────────────────────────

  const templateConfig = TEMPLATE_CONFIGS[data.selected_template];
  const skillsMode = templateConfig?.skills?.mode ?? "uncategorized";

  const categorized: Record<string, string[]> = data.skills?.categorized || {};
  const uncategorized: string[] = data.skills?.uncategorized || [];

  const getFlatSkills = (): string[] => {
    const fromCategorized = Object.values(categorized).flat();
    return [...new Set([...fromCategorized, ...uncategorized])];
  };

  const SkillChips = ({ skills }: { skills: string[] }) => (
    <View style={styles.skillChips}>
      {skills.map((skill, i) => (
        <View key={i} style={styles.skillChip}>
          <Text style={styles.skillChipText}>{skill}</Text>
        </View>
      ))}
    </View>
  );

  const renderSkills = () => {
    // ── Categorized: one labeled group per category ──
    if (skillsMode === "categorized") {
      return Object.entries(categorized).map(([category, skills], i) => {
        if (!skills || skills.length === 0) return null;
        return (
          <View key={i} style={styles.skillCategory}>
            <Text style={styles.skillCatLabel}>{category.toUpperCase()}</Text>
            <SkillChips skills={skills} />
          </View>
        );
      });
    }

    // ── Uncategorized: flat chip list ──
    if (skillsMode === "uncategorized") {
      const flat = getFlatSkills();
      if (flat.length === 0) return null;
      return (
        <View style={styles.skillCategory}>
          <SkillChips skills={flat} />
        </View>
      );
    }

    // ── Both: category groups + "Other" for uncategorized ──
    if (skillsMode === "both") {
      return (
        <>
          {Object.entries(categorized).map(([category, skills], i) => {
            if (!skills || skills.length === 0) return null;
            return (
              <View key={i} style={styles.skillCategory}>
                <Text style={styles.skillCatLabel}>
                  {category.toUpperCase()}
                </Text>
                <SkillChips skills={skills} />
              </View>
            );
          })}
          {uncategorized.length > 0 && (
            <View style={styles.skillCategory}>
              <Text style={styles.skillCatLabel}>OTHER</Text>
              <SkillChips skills={uncategorized} />
            </View>
          )}
        </>
      );
    }

    return null;
  };

  // ─────────────────────────────────────────────────────────────────────────

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
            <Text style={styles.stepText}>
              Step {step} of {totalSteps}
            </Text>
            <Text style={styles.navTitle}>REVIEW</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Heading */}
          <View style={styles.headingBlock}>
            <Text style={styles.mainHeading}>Review Your Resume</Text>
            <Text style={styles.subHeading}>
              Tap Edit on any section to make changes before generating
            </Text>
          </View>

          {/* ── Personal Info ── */}
          <Section
            icon="person-outline"
            title="Personal Information"
            stepKey="personal"
          >
            <InfoRow label="Full Name" value={data.personal_info?.name} />
            <InfoRow label="Email" value={data.personal_info?.email} />
            <InfoRow label="Phone" value={data.personal_info?.number} />
            <InfoRow label="Branch/" value={data.personal_info?.branch} />
            {data.personal_info?.city && (
              <InfoRow label="City" value={data.personal_info.city} />
            )}
          </Section>

          {/* ── Professional Summary ── */}
          {data.professional_summary?.length > 0 && (
            <Section
              icon="document-text-outline"
              title="Professional Summary"
              stepKey="summary"
            >
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>
                  {data.professional_summary}
                </Text>
              </View>
            </Section>
          )}

          {/* ── Work Experience ── */}
          <Section
            icon="briefcase-outline"
            title="Work Experience"
            stepKey="work"
          >
            {data.work_experience?.length > 0 ? (
              data.work_experience.map((exp: any, i: number) => (
                <View
                  key={i}
                  style={[styles.itemBlock, i > 0 && styles.itemBlockBorder]}
                >
                  <View style={styles.itemTitleRow}>
                    <View style={styles.itemDot} />
                    <Text style={styles.itemTitle}>
                      {exp.job_title || exp.role || "—"}
                    </Text>
                    {/* <TouchableOpacity
                      style={styles.itemEditBtn}
                      onPress={() => goToStep(STEP_MAP.work)}
                    >
                      <Ionicons name="pencil-outline" size={13} color="#aaa" />
                    </TouchableOpacity> */}
                  </View>
                  <View style={styles.itemMeta}>
                    {(exp.company_name || exp.company) && (
                      <View style={styles.metaChip}>
                        <Ionicons name="business-outline" size={12} color="#888" />
                        <Text style={styles.metaText}>
                          {exp.company_name || exp.company}
                        </Text>
                      </View>
                    )}
                    {(exp.start_month || exp.start) && (
                      <View style={styles.metaChip}>
                        <Ionicons name="calendar-outline" size={12} color="#888" />
                        <Text style={styles.metaText}>
                          {exp.start_month
                            ? `${exp.start_month}/${exp.start_year}`
                            : exp.start}{" "}
                          —{" "}
                          {exp.is_present
                            ? "Present"
                            : exp.end_month
                              ? `${exp.end_month}/${exp.end_year}`
                              : exp.end || "Present"}
                        </Text>
                      </View>
                    )}
                    {(exp.city || exp.country) && (
                      <View style={styles.metaChip}>
                        <Ionicons name="location-outline" size={12} color="#888" />
                        <Text style={styles.metaText}>
                          {[exp.city, exp.country].filter(Boolean).join(", ")}
                        </Text>
                      </View>
                    )}
                  </View>
                  {exp.description && (
                    <Text style={styles.itemDesc}>{exp.description}</Text>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyBlock}>
                <Text style={styles.emptyText}>No work experience added</Text>
                <TouchableOpacity
                  style={styles.emptyAddBtn}
                  onPress={() => goToStep(STEP_MAP.work)}
                >
                  <Ionicons name="add" size={14} color="#3BBFAD" />
                  <Text style={styles.emptyAddText}>Add now</Text>
                </TouchableOpacity>
              </View>
            )}
          </Section>

          {/* ── Projects ── */}
          <Section icon="folder-outline" title="Projects" stepKey="projects">
            {data.projects?.length > 0 ? (
              data.projects.map((proj: any, i: number) => (
                <View
                  key={i}
                  style={[styles.itemBlock, i > 0 && styles.itemBlockBorder]}
                >
                  <View style={styles.itemTitleRow}>
                    <View style={styles.itemDot} />
                    <Text style={styles.itemTitle}>{proj.title || "—"}</Text>
                    {/* <TouchableOpacity
                      style={styles.itemEditBtn}
                      onPress={() => goToStep(STEP_MAP.projects)}
                    >
                      <Ionicons name="pencil-outline" size={13} color="#aaa" />
                    </TouchableOpacity> */}
                  </View>
                  {proj.technologies && (
                    <View style={styles.techRow}>
                      {proj.technologies.split(",").map((t: string, j: number) => (
                        <View key={j} style={styles.techChip}>
                          <Text style={styles.techChipText}>{t.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {proj.description && (
                    <Text style={styles.itemDesc}>{proj.description}</Text>
                  )}
                  {proj.liveUrl && (
                    <View style={[styles.metaChip, { marginTop: 6 }]}>
                      <Ionicons name="globe-outline" size={12} color="#3BBFAD" />
                      <Text style={[styles.metaText, { color: "#3BBFAD" }]}>
                        {proj.liveUrl}
                      </Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyBlock}>
                <Text style={styles.emptyText}>No projects added</Text>
                <TouchableOpacity
                  style={styles.emptyAddBtn}
                  onPress={() => goToStep(STEP_MAP.projects)}
                >
                  <Ionicons name="add" size={14} color="#3BBFAD" />
                  <Text style={styles.emptyAddText}>Add now</Text>
                </TouchableOpacity>
              </View>
            )}
          </Section>

          {/* ── Education ── */}
          <Section icon="school-outline" title="Education" stepKey="education">
            {data.education?.map((edu: any, i: number) => (
              <View
                key={i}
                style={[styles.itemBlock, i > 0 && styles.itemBlockBorder]}
              >
                <View style={styles.itemTitleRow}>
                  <View style={styles.itemDot} />
                  <Text style={styles.itemTitle}>{edu.degree || "—"}</Text>
                </View>
                <View style={styles.itemMeta}>
                  {edu.institution && (
                    <View style={styles.metaChip}>
                      <Ionicons name="business-outline" size={12} color="#888" />
                      <Text style={styles.metaText}>{edu.institution}</Text>
                    </View>
                  )}
                  {edu.result && (
                    <View style={styles.metaChip}>
                      <Ionicons name="ribbon-outline" size={12} color="#888" />
                      <Text style={styles.metaText}>CGPA: {edu.result}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </Section>

          {/* ── Skills ── */}
          <Section icon="flash-outline" title="Skills" stepKey="skills">
            {renderSkills()}
          </Section>

          {/* ── Other Links ── */}
          {data.otherLinks && Object.values(data.otherLinks).some(Boolean) && (
            <Section
              icon="link-outline"
              title="Online Presence"
              stepKey="links"
            >
              {Object.entries(data.otherLinks).map(([key, value], i) =>
                value ? (
                  <View key={i} style={styles.linkRow}>
                    <Ionicons
                      name={
                        key === "github"
                          ? "logo-github"
                          : key === "linkedIn"
                            ? "logo-linkedin"
                            : key === "leetcode"
                              ? "code-slash-outline"
                              : key === "twitter"
                                ? "logo-twitter"
                                : "globe-outline"
                      }
                      size={16}
                      color="#3BBFAD"
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.linkLabel}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Text>
                      <Text style={styles.linkValue}>{String(value)}</Text>
                    </View>
                  </View>
                ) : null,
              )}
            </Section>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* ── Generate Button ── */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.generateBtn,
              isGenerating && styles.generateBtnLoading,
            ]}
            onPress={handleSubmit}
            disabled={isGenerating}
            activeOpacity={0.88}
          >
            {isGenerating ? (
              <View style={styles.generateBtnInner}>
                <CustomLoader size={18} color="#fff" bars={12} />
                <Text style={styles.generateBtnText}>
                  Generating your resume...
                </Text>
              </View>
            ) : (
              <View style={styles.generateBtnInner}>
                <View style={styles.generateIconBox}>
                  <Ionicons name="document-text" size={18} color="#3BBFAD" />
                </View>
                <View>
                  <Text style={styles.generateBtnLabel}>Generate Resume</Text>
                  <Text style={styles.generateBtnSub}>
                    {isSignedIn ? "Export as PDF" : "Sign in to export"}
                  </Text>
                </View>
                <Ionicons
                  name={isSignedIn ? "arrow-forward" : "lock-closed-outline"}
                  size={18}
                  color="#fff"
                  style={{ marginLeft: "auto" }}
                />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ReviewStep;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f5" },

  navbar: {
    height: 56,
    backgroundColor: "#F4F1DE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  leftIcon: { position: "absolute", left: 20 },
  centerContent: { flex: 1, alignItems: "center" },
  stepText: { fontSize: 11, color: "#3D405B", fontFamily: "WorkSansRegular" },
  navTitle: {
    fontSize: 14,
    letterSpacing: 1,
    color: "#3D405B",
    fontFamily: "WorkSansBold",
  },

  scrollContent: { paddingBottom: 20 },

  headingBlock: { paddingHorizontal: 20, paddingTop: 24, marginBottom: 20 },
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

  sectionCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#e8f5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#e8f5f2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c8e8e0",
  },
  editText: {
    fontSize: 12,
    color: "#3BBFAD",
    fontFamily: "WorkSansSemiBold",
  },
  itemEditBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  sectionDivider: { height: 1, backgroundColor: "#f0f0f0", marginBottom: 4 },

  infoRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexWrap: "wrap",
  },
  infoLabel: {
    fontSize: 12,
    color: "#aaa",
    fontFamily: "WorkSansSemiBold",
    minWidth: 90,
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 14,
    color: "#3D405B",
    fontFamily: "WorkSansRegular",
    flex: 1,
  },

  summaryBox: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#F4F1DE",
    borderRadius: 10,
    padding: 14,
  },
  summaryText: {
    fontSize: 13,
    fontFamily: "WorkSansRegular",
    color: "#3D405B",
    lineHeight: 22,
  },

  itemBlock: { paddingHorizontal: 16, paddingVertical: 12 },
  itemBlockBorder: { borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  itemTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  itemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3BBFAD",
  },
  itemTitle: {
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
    flex: 1,
  },
  itemMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  metaText: { fontSize: 12, color: "#666", fontFamily: "WorkSansRegular" },
  itemDesc: {
    fontSize: 13,
    fontFamily: "WorkSansRegular",
    color: "#666",
    lineHeight: 20,
    marginTop: 4,
  },

  techRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  techChip: {
    backgroundColor: "#e8f5f2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c8e8e0",
  },
  techChipText: {
    fontSize: 12,
    color: "#3BBFAD",
    fontFamily: "WorkSansSemiBold",
  },

  skillCategory: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
  },
  skillCatLabel: {
    fontSize: 10,
    fontFamily: "WorkSansBold",
    color: "#aaa",
    letterSpacing: 1,
    marginBottom: 8,
  },
  skillChips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  skillChip: {
    backgroundColor: "#F4F1DE",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  skillChipText: {
    fontSize: 13,
    color: "#3D405B",
    fontFamily: "WorkSansRegular",
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
  },
  linkLabel: {
    fontSize: 11,
    color: "#aaa",
    fontFamily: "WorkSansSemiBold",
    letterSpacing: 0.3,
  },
  linkValue: {
    fontSize: 13,
    color: "#3D405B",
    fontFamily: "WorkSansRegular",
    marginTop: 1,
  },

  emptyBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  emptyText: {
    fontSize: 13,
    color: "#bbb",
    fontFamily: "WorkSansRegular",
    fontStyle: "italic",
  },
  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#e8f5f2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  emptyAddText: {
    fontSize: 12,
    color: "#3BBFAD",
    fontFamily: "WorkSansSemiBold",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  generateBtn: {
    backgroundColor: "#3BBFAD",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  generateBtnLoading: { backgroundColor: "#81B29A" },
  generateBtnInner: { flexDirection: "row", alignItems: "center", gap: 12 },
  generateIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  generateBtnLabel: {
    fontSize: 16,
    fontFamily: "WorkSansSemiBold",
    color: "#fff",
  },
  generateBtnSub: {
    fontSize: 12,
    fontFamily: "WorkSansRegular",
    color: "rgba(255,255,255,0.75)",
    marginTop: 1,
  },
  generateBtnText: {
    fontSize: 15,
    fontFamily: "WorkSansRegular",
    color: "#fff",
    marginLeft: 10,
  },
});