import React, { useState, useRef, useEffect } from "react";
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ─── Data ────────────────────────────────────────────────────────

const roleExamples: Record<string, string[]> = {
  default: [
    "Collaborated with cross-functional teams to deliver projects on time.",
    "Communicated effectively with stakeholders to gather requirements.",
    "Identified and resolved issues to improve overall workflow efficiency.",
    "Documented processes and procedures for team reference.",
    "Participated in daily standups and sprint planning meetings.",
    "Supported senior team members in day-to-day operations.",
  ],
  frontend: [
    "Built responsive UI components using React and Tailwind CSS.",
    "Improved page load speed by 40% through lazy loading and code splitting.",
    "Collaborated with designers to translate Figma mockups into pixel-perfect interfaces.",
    "Integrated REST APIs and managed state using Redux.",
    "Wrote unit tests using Jest and React Testing Library.",
    "Optimized cross-browser compatibility for Chrome, Firefox, and Safari.",
  ],
  backend: [
    "Designed and developed RESTful APIs using Node.js and Express.",
    "Managed PostgreSQL and MongoDB databases with optimized query performance.",
    "Implemented JWT-based authentication and role-based access control.",
    "Deployed microservices on AWS using Docker and Kubernetes.",
    "Reduced API response time by 35% through caching with Redis.",
    "Updated legacy systems to modern standards improving functionality and usability.",
    "Developed Java-based frameworks for complex data processing.",
    "Leveraged creative problem-solving skills to complete projects within budget.",
  ],
  fullstack: [
    "Built end-to-end features from database schema to UI implementation.",
    "Developed full-stack applications using React, Node.js, and MongoDB.",
    "Integrated third-party APIs including Stripe, Twilio, and SendGrid.",
    "Led code reviews and maintained coding standards across the team.",
    "Deployed applications on Vercel and AWS with CI/CD pipelines.",
  ],
  mobile: [
    "Developed cross-platform mobile apps using React Native and Expo.",
    "Integrated Firebase for real-time database and push notifications.",
    "Published apps to Google Play Store and Apple App Store.",
    "Optimized app performance reducing load time by 50%.",
    "Implemented offline support using AsyncStorage and SQLite.",
  ],
  android: [
    "Built Android applications using Kotlin and Jetpack Compose.",
    "Integrated Google Maps SDK and location-based services.",
    "Used MVVM architecture with LiveData and ViewModel.",
    "Managed background tasks using WorkManager.",
    "Published and maintained apps on Google Play with 10k+ downloads.",
  ],
  ios: [
    "Developed iOS applications using Swift and SwiftUI.",
    "Integrated Apple Pay and in-app purchases.",
    "Used Core Data for local data persistence.",
    "Implemented push notifications using APNs.",
    "Submitted and managed apps on the Apple App Store.",
  ],
  "quality assurance": [
    "Designed and executed manual and automated test cases.",
    "Used Selenium and Cypress for end-to-end test automation.",
    "Identified and reported 200+ bugs using JIRA.",
    "Performed regression, smoke, and sanity testing for each release.",
    "Collaborated with developers to ensure timely resolution of defects.",
    "Created detailed QA documentation and test plans.",
  ],
  devops: [
    "Managed CI/CD pipelines using Jenkins and GitHub Actions.",
    "Containerized applications using Docker and orchestrated with Kubernetes.",
    "Monitored system health using Grafana and Prometheus.",
    "Automated infrastructure provisioning with Terraform.",
    "Reduced deployment time by 60% through pipeline optimization.",
  ],
  "data scientist": [
    "Built predictive models using Python, Scikit-learn, and TensorFlow.",
    "Analyzed large datasets using Pandas and NumPy.",
    "Created data visualization dashboards using Power BI and Matplotlib.",
    "Performed A/B testing and statistical analysis to drive product decisions.",
    "Cleaned and preprocessed data from multiple sources for ML pipelines.",
  ],
  "ui/ux": [
    "Designed user interfaces using Figma and Adobe XD.",
    "Conducted user research and usability testing sessions.",
    "Created wireframes, prototypes, and design systems.",
    "Collaborated with developers to ensure design consistency.",
    "Improved user retention by 25% through redesigning onboarding flow.",
  ],
  manager: [
    "Managed teams by overseeing hiring, training and professional growth of employees.",
    "Led cross-functional teams of 10+ members to deliver projects on time.",
    "Defined project roadmaps, milestones, and KPIs.",
    "Facilitated daily standups and sprint planning meetings.",
    "Leveraged creative problem-solving skills to complete projects within budget.",
    "Prepared and presented progress reports to senior stakeholders.",
  ],
  sales: [
    "Exceeded monthly sales targets by 120% consistently for 2 years.",
    "Generated and nurtured leads through cold outreach and networking.",
    "Managed a portfolio of 50+ enterprise clients.",
    "Negotiated and closed deals worth $500K+ annually.",
    "Conducted product demos and presentations for potential clients.",
  ],
};

const roleSuggestions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "Android Developer",
  "iOS Developer",
  "Quality Assurance",
  "DevOps Engineer",
  "Data Scientist",
  "UI/UX Designer",
  "Project Manager",
  "Sales Manager",
];

const getRoleKey = (title: string): string => {
  const lower = title.toLowerCase();
  if (lower.includes("frontend") || lower.includes("front end"))
    return "frontend";
  if (lower.includes("backend") || lower.includes("back end")) return "backend";
  if (lower.includes("full stack") || lower.includes("fullstack"))
    return "fullstack";
  if (lower.includes("android")) return "android";
  if (lower.includes("ios")) return "ios";
  if (
    lower.includes("mobile") ||
    lower.includes("react native") ||
    lower.includes("flutter")
  )
    return "mobile";
  if (
    lower.includes("quality") ||
    lower.includes("qa") ||
    lower.includes("test")
  )
    return "quality assurance";
  if (lower.includes("devops") || lower.includes("cloud")) return "devops";
  if (
    lower.includes("data") ||
    lower.includes("ml") ||
    lower.includes("machine")
  )
    return "data scientist";
  if (lower.includes("ui") || lower.includes("ux") || lower.includes("design"))
    return "ui/ux";
  if (
    lower.includes("manager") ||
    lower.includes("lead") ||
    lower.includes("project")
  )
    return "manager";
  if (lower.includes("sales") || lower.includes("business")) return "sales";
  return "default";
};

// ─── Types ───────────────────────────────────────────────────────
interface BulletPoint {
  id: string;
  text: string;
}

interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  bullet: boolean;
}

// ─── Role Search Modal ───────────────────────────────────────────
const RoleSearchModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSelect: (val: string) => void;
}> = ({ visible, onClose, onSelect }) => {
  const [query, setQuery] = useState("");
  const filtered = query.trim()
    ? roleSuggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const handleSelect = (val: string) => {
    onSelect(val);
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <SafeAreaView style={mStyles.container}>
        <StatusBar backgroundColor="#e8f5f2" barStyle="dark-content" />
        <View style={mStyles.searchRow}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#555"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={mStyles.searchInput}
            placeholder="Search role (e.g. Frontend, Backend...)"
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="close" size={18} color="#555" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              onClose();
            }}
          >
            <Text style={mStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={mStyles.divider} />
        {query.trim() === "" ? (
          <View style={mStyles.emptyState}>
            <Text style={mStyles.emptyTitle}>Search for your job role.</Text>
            <Text style={mStyles.emptySubtitle}>
              {`We'll suggest relevant bullet points{"\n"}to describe your`}`
              experience.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={mStyles.results}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={mStyles.sectionHeader}>CUSTOM</Text>
            <TouchableOpacity
              style={mStyles.resultRow}
              onPress={() => handleSelect(query)}
            >
              <Text style={mStyles.resultText}>{query}</Text>
            </TouchableOpacity>
            {filtered.length > 0 && (
              <>
                <Text style={mStyles.sectionHeader}>SUGGESTIONS</Text>
                {filtered.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={mStyles.resultRow}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={mStyles.resultText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};


// ─── Main Component ──────────────────────────────────────────────
interface Props {
  data: any;
  updateExperience: (index: number, field: string, value: string | boolean) => void;
  activeExperienceIndex: number;
  nextStep: () => void;
  prevStep: () => void;
  step: number;
  totalSteps: number;
}

const JobDescriptionStep: React.FC<Props> = ({
  data,
  updateExperience,
  activeExperienceIndex,
  nextStep,
  prevStep,
  step,
  totalSteps,
}) => {
  const workExperience = data.work_experience || [];
  const safeIndex = Math.min(
    Math.max(0, activeExperienceIndex),
    Math.max(0, workExperience.length - 1)
  );

  // ── Bullet state ──
  const [bullets, setBullets] = useState<BulletPoint[]>([]);
  const [past, setPast] = useState<BulletPoint[][]>([]); // undo stack
  const [future, setFuture] = useState<BulletPoint[][]>([]); // redo stack

  // ── Format state ──
  const [fmt, setFmt] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    bullet: true,
  });

  // ── Modal state ──
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  const [searchRole, setSearchRole] = useState("");

  // ── Editing state ──
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const selectedTexts = bullets.map((b) => b.text);

  // ── History helpers ──
  const commit = (next: BulletPoint[], current: BulletPoint[]) => {
    setPast((p) => [...p, current]);
    setFuture([]); // clear redo on new action
    setBullets(next);
    sync(next);
  };

  const undo = () => {
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [bullets, ...f]);
    setBullets(prev);
    sync(prev);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, bullets]);
    setBullets(next);
    sync(next);
  };

  const sync = (updated: BulletPoint[]) => {
    const description = updated.map((b) => `• ${b.text}`).join("\n");
    updateExperience(safeIndex, "description", description);
  };

  // Load bullets for the selected work experience when switching jobs (index 0 was wrong before).
  useEffect(() => {
    const raw = workExperience[safeIndex]?.description ?? "";
    if (!raw.trim()) {
      setBullets([]);
      setPast([]);
      setFuture([]);
      return;
    }
    const lines = raw.split(/\r?\n/).filter((l) => l.trim());
    const parsed: BulletPoint[] = lines.map((line, i) => ({
      id: `loaded-${safeIndex}-${i}`,
      text: line.replace(/^•\s*/, "").trim(),
    }));
    setBullets(parsed);
    setPast([]);
    setFuture([]);
  }, [safeIndex]);

  // ── Add from examples ──
  const toggleExample = (text: string) => {
    if (selectedTexts.includes(text)) {
      commit(
        bullets.filter((b) => b.text !== text),
        bullets,
      );
    } else {
      commit([...bullets, { id: Date.now().toString(), text }], bullets);
    }
  };

  // ── Inline edit ──
  const startEdit = (b: BulletPoint) => {
    setEditingId(b.id);
    setEditingText(b.text);
  };

  const saveEdit = (id: string) => {
    const updated = bullets.map((b) =>
      b.id === id ? { ...b, text: editingText } : b,
    );
    commit(updated, bullets);
    setEditingId(null);
    setEditingText("");
  };

  const addNewBullet = () => {
    const newB: BulletPoint = { id: Date.now().toString(), text: "" };
    const updated = [...bullets, newB];
    commit(updated, bullets);
    setEditingId(newB.id);
    setEditingText("");
  };

  const deleteBullet = (id: string) => {
    commit(
      bullets.filter((b) => b.id !== id),
      bullets,
    );
  };

  // ── Toggle format ──
  const toggleFmt = (key: keyof FormatState) => {
    setFmt((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
      <StatusBar backgroundColor="#e8f5f2" barStyle="dark-content" />

        {/* Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity onPress={prevStep} style={styles.leftIcon}>
            <Ionicons name="arrow-back" size={22} color="#3D405B" />
          </TouchableOpacity>
          <View style={styles.centerContent}>
            <Text style={styles.stepText}>
              Step {step} of {totalSteps}
            </Text>
            <Text style={styles.navTitle}>WORK HISTORY</Text>
          </View>
          <TouchableOpacity style={styles.rightBtn}>
            <Text style={styles.previewText}>Preview</Text>
          </TouchableOpacity>
        </View>

        {/* ── TOP SECTION (fixed, not scrollable) ── */}
        <View style={styles.topSection}>
          <Text style={styles.mainHeading}>Add your job description</Text>
          <Text style={styles.subHeading}>
            Get help writing your bullet points with the pre-written examples
            below
          </Text>

          {/* Text Area */}
          {/* // Replace the textArea ScrollView content with this: */}
          <ScrollView
            style={styles.textArea}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {bullets.map((b) => (
              <View key={b.id} style={styles.bulletRow}>
                {fmt.bullet && <Text style={styles.bulletDot}>•</Text>}
                {editingId === b.id ? (
                  <TextInput
                    style={[
                      styles.bulletInput,
                      fmt.bold && { fontWeight: "bold" },
                      fmt.italic && { fontStyle: "italic" },
                      fmt.underline && { textDecorationLine: "underline" },
                    ]}
                    value={editingText}
                    onChangeText={setEditingText}
                    onBlur={() => saveEdit(b.id)}
                    onSubmitEditing={() => saveEdit(b.id)}
                    autoFocus
                    multiline
                  />
                ) : (
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => startEdit(b)}
                  >
                    <Text
                      style={[
                        styles.bulletText,
                        fmt.bold && { fontWeight: "bold" },
                        fmt.italic && { fontStyle: "italic" },
                        fmt.underline && { textDecorationLine: "underline" },
                      ]}
                    >
                      {b.text || (
                        <Text style={{ color: "#bbb" }}>Tap to edit...</Text>
                      )}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => deleteBullet(b.id)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="close" size={16} color="#ccc" />
                </TouchableOpacity>
              </View>
            ))}

            {/* ✅ Clean open input — no button, just write */}
            <View style={styles.bulletRow}>
              {fmt.bullet && <Text style={styles.bulletDot}>•</Text>}
              <TextInput
                style={[
                  styles.bulletInput,
                  { flex: 1, minHeight: 30 },
                  fmt.bold && { fontWeight: "bold" },
                  fmt.italic && { fontStyle: "italic" },
                  fmt.underline && { textDecorationLine: "underline" },
                ]}
                placeholder="Write here..."
                placeholderTextColor="#ccc"
                multiline
                blurOnSubmit={false}
                onSubmitEditing={(e) => {
                  const text = e.nativeEvent.text.trim();
                  if (text) {
                    commit(
                      [...bullets, { id: Date.now().toString(), text }],
                      bullets,
                    );
                  }
                }}
              />
            </View>
          </ScrollView>

          {/* Toolbar */}
          <View style={styles.toolbar}>
            <TouchableOpacity
              onPress={() => toggleFmt("bullet")}
              style={[styles.toolBtn, fmt.bullet && styles.toolBtnActive]}
            >
              <Ionicons
                name="list"
                size={20}
                color={fmt.bullet ? "#3BBFAD" : "#555"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleFmt("bold")}
              style={[styles.toolBtn, fmt.bold && styles.toolBtnActive]}
            >
              <Text
                style={[
                  styles.toolText,
                  { fontFamily: "WorkSansBold" },
                  fmt.bold && styles.toolTextActive,
                ]}
              >
                B
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleFmt("italic")}
              style={[styles.toolBtn, fmt.italic && styles.toolBtnActive]}
            >
              <Text
                style={[
                  styles.toolText,
                  { fontStyle: "italic" },
                  fmt.italic && styles.toolTextActive,
                ]}
              >
                I
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleFmt("underline")}
              style={[styles.toolBtn, fmt.underline && styles.toolBtnActive]}
            >
              <Text
                style={[
                  styles.toolText,
                  { textDecorationLine: "underline" },
                  fmt.underline && styles.toolTextActive,
                ]}
              >
                U
              </Text>
            </TouchableOpacity>

            {/* Undo */}
            <TouchableOpacity
              onPress={undo}
              style={[styles.toolBtn, past.length > 0 && styles.toolBtnActive]}
              disabled={past.length === 0}
            >
              <Ionicons
                name="arrow-undo"
                size={20}
                color={past.length > 0 ? "#3BBFAD" : "#ccc"}
              />
            </TouchableOpacity>

            {/* Redo */}
            <TouchableOpacity
              onPress={redo}
              style={[
                styles.toolBtn,
                future.length > 0 && styles.toolBtnActive,
              ]}
              disabled={future.length === 0}
            >
              <Ionicons
                name="arrow-redo"
                size={20}
                color={future.length > 0 ? "#3BBFAD" : "#ccc"}
              />
            </TouchableOpacity>
          </View>

          {/* Continue */}
          <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
            <Text style={styles.continueText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>

        {/* ── EXAMPLES SECTION (fixed height, own scroll) ── */}
        <View style={styles.examplesSection}>
          <View style={styles.examplesHeader}>
            <Text style={styles.examplesLabel}>EXAMPLES FROM OUR EXPERTS</Text>
            {/* ✅ Arrow opens full screen modal */}
            <TouchableOpacity onPress={() => setShowRoleModal(true)}>
              <Ionicons name="chevron-up" size={22} color="#3D405B" />
            </TouchableOpacity>
          </View>

          {/* Role label if selected */}
          {searchRole ? (
            <TouchableOpacity
              style={styles.searchBox}
              onPress={() => setShowRoleModal(true)}
            >
              <Text style={styles.searchText}>{searchRole}</Text>
              <Ionicons
                name="search"
                size={18}
                color="#888"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.searchBox}
              onPress={() => setShowRoleModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.searchPlaceholder}>
                Tap ↑ to browse examples by role
              </Text>
              <Ionicons name="search" size={18} color="#888" />
            </TouchableOpacity>
          )}

          {/* Mini preview of examples */}
          <ScrollView
            style={styles.examplesMini}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {(roleExamples[getRoleKey(searchRole)] || [])
              .slice(0, 3)
              .map((ex, i) => {
                const isSelected = selectedTexts.includes(ex);
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.exampleCard,
                      isSelected && styles.exampleCardSelected,
                    ]}
                    onPress={() => toggleExample(ex)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.exIcon,
                        isSelected && styles.exIconSelected,
                      ]}
                    >
                      <Ionicons
                        name={isSelected ? "checkmark" : "add"}
                        size={24}
                        color="#fff"
                      />
                    </View>
                    <Text
                      style={[
                        styles.exText,
                        isSelected && styles.exTextSelected,
                      ]}
                      numberOfLines={2}
                    >
                      {ex}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            {!searchRole && (
              <Text style={styles.hintText}>
                Search your role to see relevant suggestions
              </Text>
            )}
          </ScrollView>
        </View>

        {/* Modals */}
        <RoleSearchModal
          visible={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          onSelect={(val) => setSearchRole(val)}
        />


      </View>
    </KeyboardAvoidingView>
  );
};

export default JobDescriptionStep;

// ─── Styles ──────────────────────────────────────────────────────
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
  navTitle: { fontSize: 14, letterSpacing: 1, color: "#3D405B", fontFamily: "WorkSansBold" },
  previewText: {
    color: "#3BBFAD",
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
  },

  // Top section
  topSection: { paddingHorizontal: 20 },
  mainHeading: {
    marginTop:10,
    fontSize: 28,
    color: "#3D405B",
    fontFamily: "PlayfairDisplayBold",
    lineHeight: 36,
    maxWidth: 200,
  },
  subHeading: {
    marginTop: 6,
    fontSize: 13,
    color: "#666",
    marginBottom: 14,
    lineHeight: 20,
    fontFamily: "WorkSansRegular",
  },

  // Text Area
  textArea: {
    minHeight: 140,
    maxHeight: 200,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    backgroundColor: "#fff",
    fontFamily: "WorkSansRegular",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingRight: 4,
    fontFamily: "WorkSansRegular",
  },
  bulletDot: {
    fontFamily: "WorkSansRegular",
    fontSize: 16,
    color: "#3D405B",
    marginRight: 6,
    marginTop: 2,
  },
  bulletText: {
    fontFamily: "WorkSansRegular",
    flex: 1,
    fontSize: 14,
    color: "#3D405B",
    lineHeight: 22,
  },
  bulletInput: {
    flex: 1,
    fontSize: 14,
    color: "#3D405B",
    lineHeight: 22,
    fontFamily: "WorkSansRegular",
    borderBottomWidth: 1,
    borderBottomColor: "#3BBFAD",
    paddingBottom: 2,
  },
  deleteBtn: { padding: 4, marginLeft: 4 },
  addLineBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 6,
  },
  addLineText: {
    fontFamily: "WorkSansRegular",
    fontSize: 13,
    color: "#3BBFAD",
  },

  // Toolbar
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 4,
    backgroundColor: "#fff",
  },
  toolBtn: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  toolBtnActive: { backgroundColor: "#e8f5f2" },
  toolText: { fontSize: 17, color: "#555", fontFamily: "WorkSansRegular" },
  toolTextActive: { color: "#3BBFAD" },

  // Continue
  continueBtn: {
    backgroundColor: "#3BBFAD",
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: "center",
    marginTop: 14,
    marginBottom: 10,
  },
  continueText: {
    color: "#fff",
    fontFamily: "WorkSansBold",
    fontSize: 16,
    letterSpacing: 1.5,
  },

  // Examples section
  examplesSection: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "#F4F1DE", // ✅
  },
  // Example cards on beige bg
  exampleCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0ddc8", // ✅ slightly darker than bg
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#fff", // ✅ white cards on beige bg
    gap: 10,
  },
  examplesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  examplesLabel: {
    fontSize: 14,
    color: "#3D405B",
    fontFamily: "WorkSansSemiBold",
  },

  // Search box on beige bg
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0ddc8", // ✅
    // borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#fff", // ✅ white input on beige
    marginBottom: 10,
  },
  searchText: {
    flex: 1,
    color: "#aaa",
    fontSize: 16,
    fontFamily: "WorkSansSemiBold",
    textTransform: "capitalize",
  },
  searchPlaceholder: {
    flex: 1,
    color: "#aaa",
    fontSize: 13,
    fontFamily: "WorkSansRegular",
  },

  examplesMini: {
    flex: 1,
    backgroundColor: "#F4F1DE", // ✅
  },
  //   exampleCard: {
  //     flexDirection: "row",
  //     alignItems: "flex-start",
  //     padding: 12,
  //     borderWidth: 1,
  //     borderColor: "#eee",
  //     borderRadius: 10,
  //     marginBottom: 8,
  //     backgroundColor: "#fff",
  //     gap: 10,
  //   },
  exampleCardSelected: { borderColor: "#3BBFAD", backgroundColor: "#f0faf8" },
  exIcon: {
    width: 30,
    height: 30,
    borderRadius: 16,
    backgroundColor: "#3D405B",
    justifyContent: "center",
    alignItems: "center",
  },
  exIconSelected: { backgroundColor: "#3BBFAD" },
  exText: {
    flex: 1,
    fontSize: 13,
    color: "#444",
    lineHeight: 20,
    fontFamily: "WorkSansRegular",
  },
  exTextSelected: { color: "#3BBFAD", fontWeight: "600" },
  hintText: {
    color: "#bbb",
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
    fontFamily: "WorkSansRegular",
  },
});

const mStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8f5f2", paddingTop: 20 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#3D405B",
    borderBottomWidth: 1.5,
    borderBottomColor: "#3BBFAD",
    paddingBottom: 4,
    marginRight: 8,
    fontFamily: "WorkSansRegular",
  },
  cancelText: {
    color: "#3D405B",
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
  },
  divider: { height: 1, backgroundColor: "#cde8e2" },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    color: "#3D405B",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 32,
    fontFamily: "PlayfairDisplayBold",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    lineHeight: 24,
    fontFamily: "WorkSansRegular",
  },
  results: { backgroundColor: "#fff", flex: 1 },
  sectionHeader: {
    fontSize: 11,
    fontFamily: "WorkSansSemiBold",
    color: "#888",
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  resultRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  resultText: { fontSize: 16, color: "#3D405B", fontFamily: "WorkSansRegular" },
});

const exStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3D405B",
    letterSpacing: 1,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  searchPlaceholder: { flex: 1, color: "#aaa", fontSize: 14 },
  searchActive: { flex: 1, color: "#3D405B", fontSize: 14, fontWeight: "600" },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    gap: 12,
  },
  cardSelected: { borderColor: "#3BBFAD", backgroundColor: "#f0faf8" },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#3D405B",
    justifyContent: "center",
    alignItems: "center",
  },
  iconSelected: { backgroundColor: "#3BBFAD" },
  cardText: { flex: 1, fontSize: 14, color: "#444", lineHeight: 22 },
  cardTextSelected: { color: "#3BBFAD", fontWeight: "600" },
});
