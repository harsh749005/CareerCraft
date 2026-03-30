import React, { useState, useRef } from "react";
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
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TEMPLATE_CONFIGS } from "@/config/templateConfig";

interface Props {
  data: any;
  updateCategorizedSkill: (category: string, skill: string) => void;
  updateUncategorizedSkill: (skill: string) => void;
  addSkillCategory: (categoryName: string) => void;
  onPreview: () => void;
  nextStep: () => void;
  prevStep: () => void;
  step: number;
  totalSteps: number;
}

const jobTitleSuggestions = [
  "Backend Developer", "Backend Developer Intern", "Frontend Developer",
  "Frontend Engineer", "Full Stack Developer", "Mobile App Developer",
  "Android Developer", "iOS Developer", "React Native Developer",
  "Flutter Developer", "Business Development Manager", "Sales Manager",
  "Product Manager", "Project Manager", "UI/UX Designer", "Graphic Designer",
  "Data Scientist", "Data Analyst", "Machine Learning Engineer", "DevOps Engineer",
  "Cloud Engineer", "Software Engineer", "QA Engineer", "Scrum Master",
  "Digital Marketing Manager", "SEO Specialist", "Content Writer",
  "HR Manager", "Finance Analyst", "Cybersecurity Engineer",
];

const jobSkillsMap: { keywords: string[]; skills: string[] }[] = [
  {
    keywords: ["backend", "back end", "back-end", "server", "api developer"],
    skills: ["Node.js", "Express.js", "Apache Server", "MongoDB", "PostgreSQL", "REST API", "Docker", "Redis", "GraphQL", "Nginx"],
  },
  {
    keywords: ["frontend", "front end", "front-end", "ui developer", "web developer"],
    skills: ["HTML", "CSS", "React", "JavaScript", "TypeScript", "Tailwind CSS", "Vue.js", "SASS", "Webpack", "Figma"],
  },
  {
    keywords: ["mobile", "android", "ios", "flutter", "react native", "app developer"],
    skills: ["React Native", "Flutter", "Android Studio", "Java", "Kotlin", "Swift", "Xcode", "Firebase", "Expo", "Dart"],
  },
  {
    keywords: ["business development", "bd manager", "sales manager", "growth manager"],
    skills: ["Sales Proposal Documentation", "Contract Management", "ROI Evaluation", "CRM Tools", "Lead Generation", "Market Research", "Negotiation", "KPI Tracking", "B2B Sales", "Strategic Planning"],
  },
  {
    keywords: ["fullstack", "full stack", "full-stack"],
    skills: ["React", "Node.js", "MongoDB", "Express.js", "PostgreSQL", "TypeScript", "Docker", "AWS", "GraphQL", "Redis"],
  },
  {
    keywords: ["data scientist", "data analyst", "machine learning", "ml engineer", "ai engineer"],
    skills: ["Python", "TensorFlow", "Pandas", "NumPy", "SQL", "Scikit-learn", "Matplotlib", "Power BI", "Tableau", "Jupyter"],
  },
  {
    keywords: ["devops", "cloud engineer", "infrastructure", "sre"],
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Linux", "Jenkins", "GitHub Actions", "Azure", "GCP"],
  },
  {
    keywords: ["ui", "ux", "designer", "product designer", "graphic"],
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "Wireframing", "User Research", "Illustrator", "Photoshop", "Design Systems", "Accessibility"],
  },
  {
    keywords: ["seo", "digital marketing", "content", "social media"],
    skills: ["SEO", "Google Analytics", "Content Writing", "Social Media Management", "Email Marketing", "Copywriting", "WordPress", "Canva", "Meta Ads", "Google Ads"],
  },
  {
    keywords: ["project manager", "scrum master", "product manager", "agile"],
    skills: ["Agile", "Scrum", "JIRA", "Trello", "Risk Management", "Stakeholder Management", "Roadmapping", "Sprint Planning", "Confluence", "MS Project"],
  },
];

const defaultSkills = [
  "Communication", "Teamwork", "Problem Solving", "Time Management",
  "Leadership", "Critical Thinking", "Adaptability", "Microsoft Office",
  "Project Management", "Customer Service",
];

const getSkillsForTitle = (title: string): string[] => {
  if (!title.trim()) return defaultSkills;
  const lower = title.toLowerCase();
  for (const entry of jobSkillsMap) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry.skills;
  }
  return defaultSkills;
};

const getAllSelectedSkills = (skills: any): string[] => {
  const fromCategorized = Object.values(skills?.categorized || {}).flat() as string[];
  const fromUncategorized = skills?.uncategorized || [];
  return [...new Set([...fromCategorized, ...fromUncategorized])];
};

// ── Threshold: after this many skills, show collapse toggle ──────────────────
const COLLAPSE_THRESHOLD = 4;

const SkillsStep: React.FC<Props> = ({
  data,
  updateCategorizedSkill,
  updateUncategorizedSkill,
  addSkillCategory,
  onPreview,
  nextStep,
  prevStep,
  step,
  totalSteps,
}) => {
  const [jobTitle, setJobTitle] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [modalQuery, setModalQuery] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("");

  // ── Tag box expand/collapse state ────────────────────────────────────────
  const [tagBoxExpanded, setTagBoxExpanded] = useState(false);
  const [expertBoxExpanded, setexpertBoxExpanded] = useState(false);
  const [selectedSkillsModalVisible, setSelectedSkillsModalVisible] = useState(false);
  const [selectedExpertModalVisible, setselectedExpertModalVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rotateAnimexp = useRef(new Animated.Value(0)).current;

  const toggleTagBox = () => {
    const toValue = tagBoxExpanded ? 0 : 1;

    Animated.spring(rotateAnim, {
      toValue,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();

    if (!tagBoxExpanded && allSelectedSkills.length > COLLAPSE_THRESHOLD) {
      // Expand → open full modal
      setSelectedSkillsModalVisible(true);
    }
    setTagBoxExpanded(!tagBoxExpanded);
  };

  const toggleExperOptionBox = () => {
    const toValue = expertBoxExpanded ? 0 : 1;

    Animated.spring(rotateAnimexp, {
      toValue,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
    if (!expertBoxExpanded) {

      setselectedExpertModalVisible(true);
    }
    setexpertBoxExpanded(!expertBoxExpanded);
  }
  const arrowRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const arrowRotationExpert = rotateAnimexp.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // ─── Template mode ───────────────────────────────────────────────────────
  const templateConfig = TEMPLATE_CONFIGS[data.selected_template];
  const skillsMode = templateConfig?.skills?.mode ?? "uncategorized";
  const showCategorized = skillsMode === "categorized" || skillsMode === "both";
  const showUncategorized = skillsMode === "uncategorized" || skillsMode === "both";

  const categories = Object.keys(data.skills?.categorized || {});
  const activeCategory = activeCategoryTab || categories[0] || "";
  const allSelectedSkills = getAllSelectedSkills(data.skills);
  const currentSkills = getSkillsForTitle(jobTitle);

  // Whether toggle arrow should appear
  const showToggle = allSelectedSkills.length > COLLAPSE_THRESHOLD;

  const toggleSkill = (skill: string) => {
    if (showCategorized && !showUncategorized) {
      updateCategorizedSkill(activeCategory, skill);
    } else if (showUncategorized && !showCategorized) {
      updateUncategorizedSkill(skill);
    } else {
      updateUncategorizedSkill(skill);
    }
  };

  const removeSkill = (skill: string) => {
    if (data.skills?.uncategorized?.includes(skill)) {
      updateUncategorizedSkill(skill);
      return;
    }
    for (const category of categories) {
      if (data.skills?.categorized?.[category]?.includes(skill)) {
        updateCategorizedSkill(category, skill);
        return;
      }
    }
  };

  const isSkillSelected = (skill: string): boolean => allSelectedSkills.includes(skill);

  const filteredTitles = modalQuery.trim()
    ? jobTitleSuggestions.filter((t) => t.toLowerCase().includes(modalQuery.toLowerCase()))
    : [];

  const handleSelectTitle = (title: string) => {
    setJobTitle(title);
    setModalQuery("");
    setSearchModalVisible(false);
  };

  const [newCategoryModal, setNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    addSkillCategory(newCategoryName.trim());
    setActiveCategoryTab(newCategoryName.trim());
    setNewCategoryName("");
    setNewCategoryModal(false);
  };

  // Preview tags — collapsed shows only first COLLAPSE_THRESHOLD skills
  const previewSkills = tagBoxExpanded
    ? allSelectedSkills
    : allSelectedSkills.slice(0, COLLAPSE_THRESHOLD);

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
          <Text style={styles.navTitle}>SKILLS SET</Text>
        </View>
        <TouchableOpacity style={styles.rightBtn} onPress={onPreview}>
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      </View>

      {/* ── Heading ── */}
      <View style={styles.headingBlock}>
        <Text style={styles.mainHeading}>
          Add the skills you{"\n"}want to highlight
        </Text>
        <Text style={styles.subHeading}>
          {showCategorized
            ? "Skills will be grouped by category in your resume"
            : "Search by job title to get relevant skill suggestions"}
        </Text>
      </View>

      {/* ── Selected Skills Tag Box ── */}
      <View style={styles.tagBoxWrapper}>
        {/* Header row with label + toggle arrow */}
        <View style={styles.tagBoxHeader}>
          {allSelectedSkills.length > 0 ? (
            <Text style={styles.tagBoxLabel}>
              SELECTED SKILLS
              <Text style={styles.tagBoxCount}> · {allSelectedSkills.length}</Text>
            </Text>
          ) : (
            <Text style={styles.tagBoxLabel}>SELECTED SKILLS</Text>
          )}

          {/* ↑ Arrow toggle — only visible when overflowing */}
          {showToggle && (
            <TouchableOpacity
              style={styles.expandToggle}
              onPress={toggleTagBox}
              activeOpacity={0.7}
            >
              <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
                <Ionicons name="chevron-up" size={18} color="#3BBFAD" />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>

        {/* Tags — collapsed preview */}
        <View style={styles.tagWrapper}>
          {allSelectedSkills.length === 0 ? (
            <View style={styles.tagEmptyState}>
              <Ionicons name="flash-outline" size={20} color="#ccc" />
              <Text style={styles.tagPlaceholder}>Select skills from the list below</Text>
            </View>
          ) : (
            <>
              {previewSkills.map((skill, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => removeSkill(skill)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.tagText}>{skill}</Text>
                  <Ionicons name="close" size={13} color="#fff" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
              ))}

              {/* "+N more" overflow pill — shown when collapsed and overflowing */}
              {!tagBoxExpanded && allSelectedSkills.length > COLLAPSE_THRESHOLD && (
                <TouchableOpacity
                  style={styles.overflowPill}
                  onPress={() => setSelectedSkillsModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.overflowPillText}>
                    +{allSelectedSkills.length - COLLAPSE_THRESHOLD} more
                  </Text>
                  <Ionicons name="chevron-up" size={12} color="#3BBFAD" style={{ marginLeft: 3 }} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {allSelectedSkills.length > 0 && (
          <Text style={styles.skillCount}>
            {allSelectedSkills.length} skill{allSelectedSkills.length > 1 ? "s" : ""} selected
            {showToggle && !tagBoxExpanded && (
              <Text style={styles.tapHint}>  ·  tap ↑ to see all</Text>
            )}
          </Text>
        )}
      </View>

      {/* ── Category Tabs ── */}
      {showCategorized && (
        <View style={styles.categoryTabsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryTab, activeCategory === cat && styles.categoryTabActive]}
                onPress={() => setActiveCategoryTab(cat)}
              >
                <Text style={[styles.categoryTabText, activeCategory === cat && styles.categoryTabTextActive]}>
                  {cat}
                  {data.skills?.categorized?.[cat]?.length > 0 && (
                    <Text style={styles.categoryCount}> ({data.skills.categorized[cat].length})</Text>
                  )}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addCategoryTab} onPress={() => setNewCategoryModal(true)}>
              <Ionicons name="add" size={16} color="#3BBFAD" />
              <Text style={styles.addCategoryText}>New</Text>
            </TouchableOpacity>
          </ScrollView>
          <Text style={styles.activeCategoryHint}>
            Adding skills to: <Text style={{ color: "#3BBFAD" }}>{activeCategory}</Text>
          </Text>
        </View>
      )}

      {/* ── Continue Button ── */}
      <View style={styles.continueRow}>
        <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>

      {/* ── Examples Section ── */}
      <View style={styles.examplesSection}>
        <View style={styles.examplesHeader}>
          <Text style={styles.examplesLabel}>EXAMPLES FROM OUR EXPERTS</Text>
          <TouchableOpacity
            // style={styles.expandToggle}
            onPress={toggleExperOptionBox}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ rotate: arrowRotationExpert }] }}>
              <Ionicons name="chevron-up" size={22} color="#3D405B" />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.searchBox}
          onPress={() => setSearchModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="search-outline" size={18} color={jobTitle ? "#3BBFAD" : "#aaa"} style={{ marginRight: 8 }} />
          <Text style={jobTitle ? styles.searchActiveText : styles.searchPlaceholder}>
            {jobTitle || "Search by keyword or job title"}
          </Text>
          {jobTitle && (
            <TouchableOpacity onPress={() => setJobTitle("")}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {/* skill options */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.skillsList}>
          {currentSkills.map((item, index) => {
            const isSelected = isSkillSelected(item);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.skillBox, isSelected && styles.selectedSkillBox]}
                onPress={() => toggleSkill(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconCircle, isSelected && styles.selectedIconCircle]}>
                  <Ionicons name={isSelected ? "checkmark" : "add"} size={16} color="#fff" />
                </View>
                <Text style={[styles.skillText, isSelected && styles.selectedSkillText]}>
                  {item}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={18} color="#3BBFAD" style={{ marginLeft: "auto" }} />
                )}
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      {/* ════════════════════════════════════════════════════════════════════
          ── Selected Skills Full Modal (opens when tapping ↑ or "+N more") ──
          ════════════════════════════════════════════════════════════════════ */}
      <Modal
        visible={selectedSkillsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setSelectedSkillsModalVisible(false);
          setTagBoxExpanded(false);
          Animated.spring(rotateAnim, { toValue: 0, useNativeDriver: true }).start();
        }}
      >
        <SafeAreaView style={styles.skillsModalContainer}>
          {/* Modal handle */}
          <View style={styles.modalHandle} />

          {/* Modal header */}
          <View style={styles.skillsModalHeader}>
            <View>
              <Text style={styles.skillsModalTitle}>Selected Skills</Text>
              <Text style={styles.skillsModalSubtitle}>
                {allSelectedSkills.length} skill{allSelectedSkills.length > 1 ? "s" : ""} added
              </Text>
            </View>
            <TouchableOpacity
              style={styles.skillsModalCloseBtn}
              onPress={() => {
                setSelectedSkillsModalVisible(false);
                setTagBoxExpanded(false);
                Animated.spring(rotateAnim, { toValue: 0, useNativeDriver: true }).start();
              }}
            >
              <Ionicons name="chevron-down" size={22} color="#3D405B" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.skillsModalDivider} />

          {/* All skills in a wrap grid */}
          <ScrollView
            contentContainerStyle={styles.skillsModalBody}
            showsVerticalScrollIndicator={false}
          >
            {allSelectedSkills.length === 0 ? (
              <View style={styles.skillsModalEmpty}>
                <Ionicons name="flash-outline" size={40} color="#ddd" />
                <Text style={styles.skillsModalEmptyText}>No skills selected yet</Text>
                <Text style={styles.skillsModalEmptySubText}>
                  Close this panel and add skills from the list below
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.skillsModalSectionLabel}>TAP A SKILL TO REMOVE IT</Text>
                <View style={styles.skillsModalTagGrid}>
                  {allSelectedSkills.map((skill, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.skillsModalTag}
                      onPress={() => removeSkill(skill)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.skillsModalTagText}>{skill}</Text>
                      <Ionicons name="close" size={13} color="#fff" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </ScrollView>

          {/* Bottom close button */}
          <View style={styles.skillsModalFooter}>
            <TouchableOpacity
              style={styles.skillsModalDoneBtn}
              onPress={() => {
                setSelectedSkillsModalVisible(false);
                setTagBoxExpanded(false);
                Animated.spring(rotateAnim, { toValue: 0, useNativeDriver: true }).start();
              }}
            >
              <Text style={styles.skillsModalDoneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* experts options modal */}
      <Modal
        visible={selectedExpertModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setselectedExpertModalVisible(false);
          setexpertBoxExpanded(false);
          Animated.spring(rotateAnimexp, { toValue: 0, useNativeDriver: true }).start();
        }}
      >
        <SafeAreaView style={styles.skillsModalContainer}>
          {/* Modal handle */}
          <View style={styles.modalHandle} />

          {/* Modal header */}
          <View style={styles.skillsModalHeader}>
            <View>
              <Text style={styles.skillsModalTitle}>Selected Skills</Text>
              <Text style={styles.skillsModalSubtitle}>
                {allSelectedSkills.length} skill{allSelectedSkills.length > 1 ? "s" : ""} added
              </Text>
            </View>
            <TouchableOpacity
              style={styles.skillsModalCloseBtn}
              onPress={() => {
                setselectedExpertModalVisible(false);
                setexpertBoxExpanded(false);
                Animated.spring(rotateAnimexp, { toValue: 0, useNativeDriver: true }).start();
              }}
            >
              <Ionicons name="chevron-down" size={22} color="#3D405B" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.skillsModalDivider} />

          {/* All skills in a wrap grid */}
          <ScrollView
            contentContainerStyle={styles.skillsModalBody}
            showsVerticalScrollIndicator={false}
          >
            {currentSkills.map((item, index) => {
              const isSelected = isSkillSelected(item);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.skillBox, isSelected && styles.selectedSkillBox]}
                  onPress={() => toggleSkill(item)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconCircle, isSelected && styles.selectedIconCircle]}>
                    <Ionicons name={isSelected ? "checkmark" : "add"} size={16} color="#fff" />
                  </View>
                  <Text style={[styles.skillText, isSelected && styles.selectedSkillText]}>
                    {item}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color="#3BBFAD" style={{ marginLeft: "auto" }} />
                  )}
                </TouchableOpacity>
              );
            })}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Bottom close button */}
          <View style={styles.skillsModalFooter}>
            <TouchableOpacity
              style={styles.skillsModalDoneBtn}
              onPress={() => {
                setselectedExpertModalVisible(false);
                setexpertBoxExpanded(false);
                Animated.spring(rotateAnimexp, { toValue: 0, useNativeDriver: true }).start();
              }}
            >
              <Text style={styles.skillsModalDoneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ── Job Title Search Modal ── */}
      <Modal visible={searchModalVisible} animationType="fade" statusBarTranslucent>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#e8f5f2" }}>
          <StatusBar backgroundColor="#e8f5f2" barStyle="dark-content" />
          <View style={styles.modalSearchRow}>
            <Ionicons name="search-outline" size={18} color="#555" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search by keyword or job title"
              placeholderTextColor="#aaa"
              value={modalQuery}
              onChangeText={setModalQuery}
              autoFocus
            />
            {modalQuery.length > 0 && (
              <TouchableOpacity onPress={() => setModalQuery("")} style={{ marginRight: 10 }}>
                <Ionicons name="close" size={18} color="#555" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => { setSearchModalVisible(false); setModalQuery(""); }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalDivider} />
          <View style={{ flex: 1, backgroundColor: modalQuery.trim() ? "#fff" : "#e8f5f2" }}>
            {modalQuery.trim() === "" && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Start typing to search for{"\n"}your job title.</Text>
                <Text style={styles.emptySubtitle}>This will help us provide you with{"\n"}relevant content.</Text>
              </View>
            )}
            {modalQuery.trim().length > 0 && (
              <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
                <Text style={styles.sectionHeader}>CUSTOM</Text>
                <TouchableOpacity style={styles.resultRow} onPress={() => handleSelectTitle(modalQuery)}>
                  <Text style={styles.resultText}>{modalQuery}</Text>
                </TouchableOpacity>
                {filteredTitles.length > 0 && (
                  <>
                    <Text style={styles.sectionHeader}>SUGGESTIONS</Text>
                    {filteredTitles.map((title, index) => (
                      <TouchableOpacity key={index} style={styles.resultRow} onPress={() => handleSelectTitle(title)}>
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

      {/* ── New Category Modal ── */}
      <Modal visible={newCategoryModal} animationType="fade" transparent statusBarTranslucent>
        <View style={styles.newCategoryOverlay}>
          <View style={styles.newCategoryBox}>
            <Text style={styles.newCategoryTitle}>Add Category</Text>
            <TextInput
              style={styles.newCategoryInput}
              placeholder="e.g. Frontend, Cloud, Soft Skills"
              placeholderTextColor="#aaa"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
            />
            <View style={styles.newCategoryActions}>
              <TouchableOpacity style={styles.newCategoryCancel} onPress={() => { setNewCategoryModal(false); setNewCategoryName(""); }}>
                <Text style={styles.newCategoryCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.newCategoryConfirm} onPress={handleAddCategory}>
                <Text style={styles.newCategoryConfirmText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SkillsStep;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Navbar
  navbar: {
    height: 56, backgroundColor: "#F4F1DE",
    flexDirection: "row", alignItems: "center", paddingHorizontal: 20,
  },
  leftIcon: { position: "absolute", left: 20 },
  rightBtn: { position: "absolute", right: 20 },
  centerContent: { flex: 1, alignItems: "center" },
  stepText: { fontSize: 11, color: "#3D405B", fontFamily: "WorkSansRegular" },
  navTitle: { fontSize: 14, letterSpacing: 1, color: "#3D405B", fontFamily: "WorkSansBold" },
  previewText: { color: "#3BBFAD", fontFamily: "WorkSansSemiBold", fontSize: 15 },

  // Heading
  headingBlock: { paddingHorizontal: 20, paddingTop: 24, marginBottom: 20 },
  mainHeading: {
    fontSize: 30, color: "#3D405B", fontFamily: "PlayfairDisplayBold",
    lineHeight: 36, 
  },
  subHeading: { marginTop: 8,fontSize: 14, color: "#888", fontFamily: "WorkSansRegular", lineHeight: 20 },

  // ── Tag Box ─────────────────────────────────────────────────────────────────
  tagBoxWrapper: {
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#ddd",
    backgroundColor: "#fafafa", paddingHorizontal: 20,
    paddingTop: 10, paddingBottom: 8, minHeight: 80,
  },
  tagBoxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tagBoxLabel: {
    fontSize: 10, fontFamily: "WorkSansBold",
    color: "#3D405B", letterSpacing: 1,
  },
  tagBoxCount: {
    color: "#3BBFAD", fontFamily: "WorkSansBold",
  },
  expandToggle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#e8f5f2",
    justifyContent: "center", alignItems: "center",
  },
  tagWrapper: {
    flexDirection: "row", flexWrap: "wrap",
    gap: 8, alignItems: "center", paddingBottom: 4,
  },
  tagEmptyState: {
    flex: 1, flexDirection: "row", alignItems: "center",
    gap: 8, paddingVertical: 16,
  },
  tagPlaceholder: { color: "#bbb", fontSize: 14, fontFamily: "WorkSansRegular" },
  tag: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#3BBFAD", borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  tagText: { color: "#fff", fontSize: 13, fontFamily: "WorkSansSemiBold" },

  // "+N more" overflow pill
  overflowPill: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderColor: "#3BBFAD",
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: "#f0faf8",
  },
  overflowPillText: {
    color: "#3BBFAD", fontSize: 12, fontFamily: "WorkSansSemiBold",
  },

  skillCount: { fontSize: 11, color: "#3BBFAD", fontFamily: "WorkSansSemiBold", textAlign: "right", marginTop: 6 },
  tapHint: { color: "#bbb", fontFamily: "WorkSansRegular" },

  // Category Tabs
  categoryTabsWrapper: { paddingTop: 10, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: "#eee" },
  categoryTabs: { paddingHorizontal: 16 },
  categoryTab: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, backgroundColor: "#f0f0f0", marginRight: 8,
  },
  categoryTabActive: { backgroundColor: "#3BBFAD" },
  categoryTabText: { fontSize: 13, color: "#3D405B", fontFamily: "WorkSansSemiBold" },
  categoryTabTextActive: { color: "#fff" },
  categoryCount: { fontSize: 11, opacity: 0.8 },
  addCategoryTab: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: "#3BBFAD",
    marginRight: 8, gap: 4,
  },
  addCategoryText: { fontSize: 13, color: "#3BBFAD", fontFamily: "WorkSansSemiBold" },
  activeCategoryHint: {
    fontSize: 12, color: "#888", fontFamily: "WorkSansRegular",
    paddingHorizontal: 20, paddingTop: 6, paddingBottom: 2,
  },

  // Continue
  continueRow: { paddingHorizontal: 20 },
  continueBtn: {
    backgroundColor: "#3BBFAD", paddingVertical: 16,
    borderRadius: 32, alignItems: "center", marginTop: 16, marginBottom: 8,
  },
  continueText: { color: "#fff", fontWeight: "bold", fontSize: 16, letterSpacing: 1.5, fontFamily: "WorkSansBold" },

  // Examples
  examplesSection: {
    flex: 1, backgroundColor: "#F4F1DE",
    paddingHorizontal: 20, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: "#e8e4d0",
  },
  examplesHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 12,
  },
  examplesLabel: { fontSize: 11, fontWeight: "bold", color: "#3D405B", letterSpacing: 1, fontFamily: "WorkSansBold" },
  searchBox: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#e0ddc8", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: "#fff", marginBottom: 12,
  },
  searchPlaceholder: { flex: 1, color: "#aaa", fontSize: 14, fontFamily: "WorkSansRegular" },
  searchActiveText: { flex: 1, color: "#3D405B", fontSize: 14, fontFamily: "WorkSansSemiBold" },
  skillsList: { flex: 1 },
  skillBox: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 13, paddingHorizontal: 12,
    borderWidth: 1, borderColor: "#e0ddc8",
    borderRadius: 12, marginBottom: 10, backgroundColor: "#fff",
  },
  selectedSkillBox: { borderColor: "#3BBFAD", backgroundColor: "#f0faf8" },
  iconCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "#3D405B", justifyContent: "center",
    alignItems: "center", marginRight: 12,
  },
  selectedIconCircle: { backgroundColor: "#3BBFAD" },
  skillText: { fontSize: 15, color: "#3D405B", fontFamily: "WorkSansRegular", flex: 1 },
  selectedSkillText: { color: "#3BBFAD", fontFamily: "WorkSansSemiBold" },

  // ── Selected Skills Full Modal ───────────────────────────────────────────────
  skillsModalContainer: {
    flex: 1, backgroundColor: "#fff",
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: "#ddd", alignSelf: "center", marginTop: 12, marginBottom: 8,
  },
  skillsModalHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "flex-start", paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16,
  },
  skillsModalTitle: {
    fontSize: 22, fontFamily: "PlayfairDisplayBold", color: "#3D405B",
  },
  skillsModalSubtitle: {
    fontSize: 13, fontFamily: "WorkSansRegular", color: "#888", marginTop: 2,
  },
  skillsModalCloseBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center",
  },
  skillsModalDivider: { height: 1, backgroundColor: "#eee", marginHorizontal: 24 },
  skillsModalBody: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  skillsModalSectionLabel: {
    fontSize: 10, fontFamily: "WorkSansBold", color: "#aaa",
    letterSpacing: 1.2, marginBottom: 14,
  },
  skillsModalTagGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 10,
  },
  skillsModalTag: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#3BBFAD", borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  skillsModalTagText: { color: "#fff", fontSize: 14, fontFamily: "WorkSansSemiBold" },
  skillsModalEmpty: {
    alignItems: "center", paddingTop: 60, gap: 12,
  },
  skillsModalEmptyText: {
    fontSize: 18, fontFamily: "PlayfairDisplayBold",
    color: "#3D405B", marginTop: 12,
  },
  skillsModalEmptySubText: {
    fontSize: 14, fontFamily: "WorkSansRegular",
    color: "#aaa", textAlign: "center", lineHeight: 22,
  },
  skillsModalFooter: {
    paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: "#eee",
  },
  skillsModalDoneBtn: {
    backgroundColor: "#3D405B", paddingVertical: 16,
    borderRadius: 32, alignItems: "center",
  },
  skillsModalDoneBtnText: {
    color: "#fff", fontSize: 16, fontFamily: "WorkSansBold", letterSpacing: 1.2,
  },

  // Job Title Modal
  modalSearchRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: "#e8f5f2", marginTop: 20,
  },
  modalSearchInput: {
    flex: 1, fontSize: 15, color: "#3D405B", fontFamily: "WorkSansRegular",
    borderBottomWidth: 1.5, borderBottomColor: "#3BBFAD",
    paddingBottom: 4, marginRight: 8,
  },
  cancelText: { color: "#3D405B", fontSize: 15, fontFamily: "WorkSansSemiBold" },
  modalDivider: { height: 1, backgroundColor: "#cde8e2" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 },
  emptyTitle: {
    fontSize: 22, fontFamily: "PlayfairDisplayBold", color: "#3D405B",
    textAlign: "center", marginBottom: 16, lineHeight: 32,
  },
  emptySubtitle: {
    fontSize: 15, color: "#555", fontFamily: "WorkSansRegular",
    textAlign: "center", lineHeight: 24,
  },
  sectionHeader: {
    fontSize: 11, fontWeight: "bold", color: "#888", letterSpacing: 1,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, fontFamily: "WorkSansBold",
  },
  resultRow: { paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: "#eee" },
  resultText: { fontSize: 16, color: "#3D405B", fontFamily: "WorkSansRegular" },

  // New Category Modal
  newCategoryOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center", alignItems: "center", paddingHorizontal: 32,
  },
  newCategoryBox: { backgroundColor: "#fff", borderRadius: 16, padding: 24, width: "100%" },
  newCategoryTitle: { fontSize: 18, fontFamily: "PlayfairDisplayBold", color: "#3D405B", marginBottom: 16 },
  newCategoryInput: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15,
    fontFamily: "WorkSansRegular", color: "#3D405B", marginBottom: 20,
  },
  newCategoryActions: { flexDirection: "row", gap: 12 },
  newCategoryCancel: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1, borderColor: "#ddd", alignItems: "center",
  },
  newCategoryCancelText: { color: "#888", fontFamily: "WorkSansSemiBold", fontSize: 15 },
  newCategoryConfirm: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: "#3BBFAD", alignItems: "center" },
  newCategoryConfirmText: { color: "#fff", fontFamily: "WorkSansBold", fontSize: 15 },
});