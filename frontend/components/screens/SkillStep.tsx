import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
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

// Default skills shown before any search
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
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.skills;
    }
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

  // Filter job title suggestions in modal
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
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={prevStep} style={styles.leftIcon}>
          <Ionicons name="arrow-back" size={22} color="#3D405B" />
        </TouchableOpacity>
        <View style={styles.centerContent}>
          <Text style={styles.stepText}>
            Step {step} of {totalSteps}
          </Text>
          <Text style={styles.title}>SKILL STEP</Text>
        </View>
        <TouchableOpacity style={styles.rightBtn}>
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      </View>

      {/* Heading */}
      <Text style={styles.mainHeading}>
        Add the skills you want to highlight
      </Text>
      <Text style={styles.subHeading}>
        You can search or add your own skills
      </Text>

      {/* Skills Tag Box */}
      <View style={styles.tagBox}>
        <ScrollView style={{ maxHeight: 130 }}>
          <View style={styles.tagWrapper}>
            {selectedSkills.map((skill, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{skill}</Text>
                <TouchableOpacity onPress={() => removeSkill(skill)}>
                  <Ionicons
                    name="close"
                    size={14}
                    color="#fff"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              </View>
            ))}
            {selectedSkills.length === 0 && (
              <Text style={styles.tagPlaceholder}>
                Your selected skills appear here...
              </Text>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
        <Text style={styles.continueText}>CONTINUE</Text>
      </TouchableOpacity>

      {/* Examples Section Header */}
      <View style={styles.examplesRow}>
        <Text style={styles.examplesLabel}>EXAMPLES FROM OUR EXPERTS</Text>
        <Ionicons name="chevron-up" size={18} color="#3D405B" />
      </View>

      {/* ✅ Search Box — tapping opens full screen modal */}
      <TouchableOpacity
        style={styles.searchBox}
        onPress={() => setSearchModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color="#666"
          style={{ marginRight: 8 }}
        />
        <Text
          style={jobTitle ? styles.searchActiveText : styles.searchPlaceholder}
        >
          {jobTitle || "Search by keyword or job title"}
        </Text>
      </TouchableOpacity>

      {/* Skills List */}
      <ScrollView
        style={{ marginTop: 12 }}
        showsVerticalScrollIndicator={false}
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
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ✅ Full Screen Search Modal */}
      <Modal
        visible={searchModalVisible}
        animationType="fade"
        statusBarTranslucent
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar backgroundColor="#e8f5f2" barStyle="dark-content" />

          {/* Modal Search Bar */}
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
              <TouchableOpacity onPress={() => setModalQuery("")}>
                <Ionicons
                  name="close"
                  size={18}
                  color="#555"
                  style={{ marginRight: 8 }}
                />
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

          {/* Empty State */}
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
              style={styles.modalResults}
              keyboardShouldPersistTaps="handled"
            >
              {/* Custom option */}
              <Text style={styles.sectionHeader}>CUSTOM</Text>
              <TouchableOpacity
                style={styles.resultRow}
                onPress={() => handleSelectTitle(modalQuery)}
              >
                <Text style={styles.resultText}>{modalQuery}</Text>
              </TouchableOpacity>

              {/* Suggestions */}
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
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default SkillsStep;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F1DE", paddingHorizontal: 20 },

  navbar: { height: 50, justifyContent: "center" },
  leftIcon: { position: "absolute", left: 0 },
  rightBtn: { position: "absolute", right: 0 },
  centerContent: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  stepText: { fontFamily: "WorkSansRegular", fontSize: 12, color: "#3D405B" },
  previewText: { color: "#81B29A", fontFamily: "WorkSansSemiBold" },
  title: {
    textAlign: "center",
    fontSize: 14,
    letterSpacing: 1,
    color: "#6c6c6c",
    fontFamily: "WorkSansBold",
  },

  mainHeading: {
    marginTop: 10,
    fontSize: 30,
    color: "#3D405B",
    fontFamily: "PlayfairDisplayBold",
  },
  subHeading: {
    marginTop: 8,
    fontSize: 14,
    color: "#6c6c6c",
    fontFamily: "WorkSansRegular",
    marginBottom: 10,
  },

  tagBox: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: "#fff",
    minHeight: 80,
  },
  tagWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#81B29A",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  tagPlaceholder: {
    color: "#aaa",
    fontSize: 13,
    fontFamily: "WorkSansRegular",
  },

  continueBtn: {
    backgroundColor: "#3BBFAD",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  continueText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },

  examplesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 10,
  },
  examplesLabel: { fontSize: 12, fontWeight: "bold", color: "#3D405B" },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
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

  skillBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  selectedSkillBox: { borderColor: "#81B29A", backgroundColor: "#f7fbf9" },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#3D405B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  selectedIconCircle: { backgroundColor: "#81B29A" },
  skillText: { fontSize: 15, color: "#333", fontFamily: "WorkSansRegular" },
  selectedSkillText: { color: "#81B29A", fontWeight: "600" },

  // Modal styles
  modalContainer: { flex: 1, backgroundColor: "#e8f5f2" },

  modalSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#e8f5f2",
    marginTop: 30,
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

  modalDivider: { height: 1, backgroundColor: "#cde8e2", marginBottom: 8 },

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

  modalResults: { backgroundColor: "#fff", flex: 1 },
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
  resultText: { fontSize: 16, color: "#3D405B", fontFamily: "WorkSansRegular" },
});
