import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  data: any;
  updateSkill: any;
  nextStep: () => void;
  prevStep: () => void;
  step: number;
  totalSteps: number;
}

const jobTitleSuggestions = [
  "Backend Developer",
  "Backend Developer Intern",
  "Frontend Developer",
  "Frontend Engineer",
  "Full Stack Developer",
  "Mobile App Developer",
  "Android Developer",
  "iOS Developer",
  "React Native Developer",
  "Flutter Developer",
  "Business Development Manager",
  "Sales Manager",
  "Product Manager",
  "Project Manager",
  "UI/UX Designer",
  "Graphic Designer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Software Engineer",
  "QA Engineer",
  "Scrum Master",
  "Digital Marketing Manager",
  "SEO Specialist",
  "Content Writer",
  "HR Manager",
  "Finance Analyst",
  "Cybersecurity Engineer",
];

const jobSkillsMap: { keywords: string[]; skills: string[] }[] = [
  {
    keywords: ["backend", "back end", "back-end", "server", "api developer"],
    skills: [
      "Node.js",
      "Express.js",
      "Apache Server",
      "MongoDB",
      "PostgreSQL",
      "REST API",
      "Docker",
      "Redis",
      "GraphQL",
      "Nginx",
    ],
  },
  {
    keywords: [
      "frontend",
      "front end",
      "front-end",
      "ui developer",
      "web developer",
    ],
    skills: [
      "HTML",
      "CSS",
      "React",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "Vue.js",
      "SASS",
      "Webpack",
      "Figma",
    ],
  },
  {
    keywords: [
      "mobile",
      "android",
      "ios",
      "flutter",
      "react native",
      "app developer",
    ],
    skills: [
      "React Native",
      "Flutter",
      "Android Studio",
      "Java",
      "Kotlin",
      "Swift",
      "Xcode",
      "Firebase",
      "Expo",
      "Dart",
    ],
  },
  {
    keywords: [
      "business development",
      "bd manager",
      "sales manager",
      "growth manager",
    ],
    skills: [
      "Sales Proposal Documentation",
      "Contract Management",
      "ROI Evaluation",
      "CRM Tools",
      "Lead Generation",
      "Market Research",
      "Negotiation",
      "KPI Tracking",
      "B2B Sales",
      "Strategic Planning",
    ],
  },
  {
    keywords: ["fullstack", "full stack", "full-stack"],
    skills: [
      "React",
      "Node.js",
      "MongoDB",
      "Express.js",
      "PostgreSQL",
      "TypeScript",
      "Docker",
      "AWS",
      "GraphQL",
      "Redis",
    ],
  },
  {
    keywords: [
      "data scientist",
      "data analyst",
      "machine learning",
      "ml engineer",
      "ai engineer",
    ],
    skills: [
      "Python",
      "TensorFlow",
      "Pandas",
      "NumPy",
      "SQL",
      "Scikit-learn",
      "Matplotlib",
      "Power BI",
      "Tableau",
      "Jupyter",
    ],
  },
  {
    keywords: ["devops", "cloud engineer", "infrastructure", "sre"],
    skills: [
      "Docker",
      "Kubernetes",
      "AWS",
      "CI/CD",
      "Terraform",
      "Linux",
      "Jenkins",
      "GitHub Actions",
      "Azure",
      "GCP",
    ],
  },
  {
    keywords: ["ui", "ux", "designer", "product designer", "graphic"],
    skills: [
      "Figma",
      "Adobe XD",
      "Sketch",
      "Prototyping",
      "Wireframing",
      "User Research",
      "Illustrator",
      "Photoshop",
      "Design Systems",
      "Accessibility",
    ],
  },
  {
    keywords: ["seo", "digital marketing", "content", "social media"],
    skills: [
      "SEO",
      "Google Analytics",
      "Content Writing",
      "Social Media Management",
      "Email Marketing",
      "Copywriting",
      "WordPress",
      "Canva",
      "Meta Ads",
      "Google Ads",
    ],
  },
  {
    keywords: ["project manager", "scrum master", "product manager", "agile"],
    skills: [
      "Agile",
      "Scrum",
      "JIRA",
      "Trello",
      "Risk Management",
      "Stakeholder Management",
      "Roadmapping",
      "Sprint Planning",
      "Confluence",
      "MS Project",
    ],
  },
];

const defaultSkills = [
  "Communication",
  "Teamwork",
  "Problem Solving",
  "Time Management",
  "Leadership",
  "Critical Thinking",
  "Adaptability",
  "Microsoft Office",
  "Project Management",
  "Customer Service",
];

const getSkillsForTitle = (title: string): string[] => {
  if (!title.trim()) return defaultSkills;
  const lower = title.toLowerCase();
  for (const entry of jobSkillsMap) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry.skills;
  }
  return defaultSkills;
};

const SkillsStep: React.FC<Props> = ({
  data,
  updateSkill,
  nextStep,
  prevStep,
  step,
  totalSteps,
}) => {
  const [jobTitle, setJobTitle] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [modalQuery, setModalQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    data.skills?.languages || [],
  );

  const currentSkills = getSkillsForTitle(jobTitle);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
    updateSkill(skill);
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
    updateSkill(skill);
  };

  const filteredTitles = modalQuery.trim()
    ? jobTitleSuggestions.filter((t) =>
        t.toLowerCase().includes(modalQuery.toLowerCase()),
      )
    : [];

  const handleSelectTitle = (title: string) => {
    setJobTitle(title);
    setModalQuery("");
    setSearchModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />

      {/* ── Navbar ── */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={prevStep} style={styles.leftIcon}>
          <Ionicons name="arrow-back" size={22} color="#3D405B" />
        </TouchableOpacity>
        <View style={styles.centerContent}>
          <Text style={styles.stepText}>
            Step {step} of {totalSteps}
          </Text>
          <Text style={styles.navTitle}>SKILLS SET</Text>
        </View>
        <TouchableOpacity style={styles.rightBtn}>
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      </View>

      {/* ── Heading ── */}
      <View style={styles.headingBlock}>
        <Text style={styles.mainHeading}>
          Add the skills you{"\n"}want to highlight
        </Text>
        <Text style={styles.subHeading}>
          Search by job title to get relevant skill suggestions
        </Text>
      </View>

      {/* ── Skills Tag Box — full width top/bottom borders ── */}
      <View style={styles.tagBoxWrapper}>
        {selectedSkills.length > 0 && (
          <Text style={styles.tagBoxLabel}>SELECTED SKILLS</Text>
        )}
        <ScrollView
          style={{ maxHeight: 140 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.tagWrapper}>
            {selectedSkills.length === 0 ? (
              <View style={styles.tagEmptyState}>
                <Ionicons name="flash-outline" size={20} color="#ccc" />
                <Text style={styles.tagPlaceholder}>
                  Select skills from the list below
                </Text>
              </View>
            ) : (
              selectedSkills.map((skill, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => removeSkill(skill)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.tagText}>{skill}</Text>
                  <Ionicons
                    name="close"
                    size={13}
                    color="#fff"
                    style={{ marginLeft: 5 }}
                  />
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>

        {/* Skills count */}
        {selectedSkills.length > 0 && (
          <Text style={styles.skillCount}>
            {selectedSkills.length} skill{selectedSkills.length > 1 ? "s" : ""}{" "}
            selected
          </Text>
        )}
      </View>

      {/* ── Continue Button ── */}
      <View style={styles.continueRow}>
        <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>

      {/* ── Examples Section ── */}
      <View style={styles.examplesSection}>
        {/* Header */}
        <View style={styles.examplesHeader}>
          <Text style={styles.examplesLabel}>EXAMPLES FROM OUR EXPERTS</Text>
          <Ionicons name="chevron-up" size={18} color="#3D405B" />
        </View>

        {/* Search box — opens modal */}
        <TouchableOpacity
          style={styles.searchBox}
          onPress={() => setSearchModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={jobTitle ? "#3BBFAD" : "#aaa"}
            style={{ marginRight: 8 }}
          />
          <Text
            style={
              jobTitle ? styles.searchActiveText : styles.searchPlaceholder
            }
          >
            {jobTitle || "Search by keyword or job title"}
          </Text>
          {jobTitle && (
            <TouchableOpacity onPress={() => setJobTitle("")}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Skills List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.skillsList}
        >
          {currentSkills.map((item, index) => {
            const isSelected = selectedSkills.includes(item);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.skillBox, isSelected && styles.selectedSkillBox]}
                onPress={() => toggleSkill(item)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconCircle,
                    isSelected && styles.selectedIconCircle,
                  ]}
                >
                  <Ionicons
                    name={isSelected ? "checkmark" : "add"}
                    size={16}
                    color="#fff"
                  />
                </View>
                <Text
                  style={[
                    styles.skillText,
                    isSelected && styles.selectedSkillText,
                  ]}
                >
                  {item}
                </Text>
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#3BBFAD"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      {/* ── Full Screen Search Modal ── */}
      <Modal
        visible={searchModalVisible}
        animationType="fade"
        statusBarTranslucent
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#e8f5f2" }}>
          <StatusBar backgroundColor="#e8f5f2" barStyle="dark-content" />

          {/* Search bar */}
          <View style={styles.modalSearchRow}>
            <Ionicons
              name="search-outline"
              size={18}
              color="#555"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search by keyword or job title"
              placeholderTextColor="#aaa"
              value={modalQuery}
              onChangeText={setModalQuery}
              autoFocus
            />
            {modalQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setModalQuery("")}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="close" size={18} color="#555" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setSearchModalVisible(false);
                setModalQuery("");
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalDivider} />

          {/* Wrap in flex:1 view */}
          <View
            style={{
              flex: 1,
              backgroundColor: modalQuery.trim() ? "#fff" : "#e8f5f2",
            }}
          >
            {/* Empty state */}
            {modalQuery.trim() === "" && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>
                  Start typing to search for{"\n"}your job title.
                </Text>
                <Text style={styles.emptySubtitle}>
                  This will help us provide you with{"\n"}relevant content.
                </Text>
              </View>
            )}

            {/* Results */}
            {modalQuery.trim().length > 0 && (
              <ScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.sectionHeader}>CUSTOM</Text>
                <TouchableOpacity
                  style={styles.resultRow}
                  onPress={() => handleSelectTitle(modalQuery)}
                >
                  <Text style={styles.resultText}>{modalQuery}</Text>
                </TouchableOpacity>

                {filteredTitles.length > 0 && (
                  <>
                    <Text style={styles.sectionHeader}>SUGGESTIONS</Text>
                    {filteredTitles.map((title, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.resultRow}
                        onPress={() => handleSelectTitle(title)}
                      >
                        <Text style={styles.resultText}>{title}</Text>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default SkillsStep;

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
  leftIcon: { position: "absolute", left: 20 },
  rightBtn: { position: "absolute", right: 20 },
  centerContent: { flex: 1, alignItems: "center" },
  stepText: { fontSize: 11, color: "#3D405B", fontFamily: "WorkSansRegular" },
  navTitle: {
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#3D405B",
    fontFamily: "WorkSansBold",
  },
  previewText: {
    color: "#3BBFAD",
    fontFamily: "WorkSansSemiBold",
    fontSize: 15,
  },

  // Heading
  headingBlock: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 16 },
  mainHeading: {
    fontSize: 28,
    color: "#3D405B",
    fontFamily: "PlayfairDisplayBold",
    lineHeight: 36,
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 14,
    color: "#888",
    fontFamily: "WorkSansRegular",
    lineHeight: 20,
  },

  // ── Tag Box — full width top/bottom borders ──
  tagBoxWrapper: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    minHeight: 80,
  },
  tagBoxLabel: {
    fontSize: 10,
    fontFamily: "WorkSansBold",
    color: "#3D405B",
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    paddingBottom: 4,
  },
  tagEmptyState: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  tagPlaceholder: {
    color: "#bbb",
    fontSize: 14,
    fontFamily: "WorkSansRegular",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3BBFAD",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "WorkSansSemiBold",
  },
  skillCount: {
    fontSize: 11,
    color: "#3BBFAD",
    fontFamily: "WorkSansSemiBold",
    textAlign: "right",
    marginTop: 6,
  },

  // Continue
  continueRow: { paddingHorizontal: 20 },
  continueBtn: {
    backgroundColor: "#3BBFAD",
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  continueText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1.5,
    fontFamily: "WorkSansBold",
  },

  // Examples Section
  examplesSection: {
    flex: 1,
    backgroundColor: "#F4F1DE",
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e8e4d0",
  },
  examplesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  examplesLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#3D405B",
    letterSpacing: 1,
    fontFamily: "WorkSansBold",
  },

  // Search box
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0ddc8",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  searchPlaceholder: {
    flex: 1,
    color: "#aaa",
    fontSize: 14,
    fontFamily: "WorkSansRegular",
  },
  searchActiveText: {
    flex: 1,
    color: "#3D405B",
    fontSize: 14,
    fontFamily: "WorkSansSemiBold",
  },

  // Skills list
  skillsList: { flex: 1 },
  skillBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0ddc8",
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  selectedSkillBox: {
    borderColor: "#3BBFAD",
    backgroundColor: "#f0faf8",
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#3D405B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectedIconCircle: { backgroundColor: "#3BBFAD" },
  skillText: {
    fontSize: 15,
    color: "#3D405B",
    fontFamily: "WorkSansRegular",
    flex: 1,
  },
  selectedSkillText: {
    color: "#3BBFAD",
    fontFamily: "WorkSansSemiBold",
  },

  // Modal
  modalSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#e8f5f2",
    marginTop: 20,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 15,
    color: "#3D405B",
    fontFamily: "WorkSansRegular",
    borderBottomWidth: 1.5,
    borderBottomColor: "#3BBFAD",
    paddingBottom: 4,
    marginRight: 8,
  },
  cancelText: {
    color: "#3D405B",
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
  },
  modalDivider: { height: 1, backgroundColor: "#cde8e2" },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 32,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#555",
    fontFamily: "WorkSansRegular",
    textAlign: "center",
    lineHeight: 24,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#888",
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    fontFamily: "WorkSansBold",
  },
  resultRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  resultText: {
    fontSize: 16,
    color: "#3D405B",
    fontFamily: "WorkSansRegular",
  },
});
