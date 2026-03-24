import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  FlatList,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WorkExperienceStepProps {
  data: any;
  addExperience: any;
  updateExperience: any;
  removeExperience: any;
  /** Index in `data.work_experience` this screen edits (must match JobDescription + summary actions). */
  activeExperienceIndex: number;
  nextStep: () => void;
  prevStep: () => void;
  step: number;
  totalSteps: number;
}

// ─── Static Data ───────────────────────────────────────────────
const jobTitleSuggestions = [
  "Backend Developer",
  "Backend Developer Intern",
  "Django Backend Developer",
  "Frontend Developer",
  "Frontend Engineer",
  "React Frontend Developer",
  "Full Stack Developer",
  "Full Stack Engineer",
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
  "System Administrator",
  "Network Engineer",
  "Technical Lead",
  "Engineering Manager",
  "CTO",
];

const companySuggestions = [
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Netflix",
  "Uber",
  "Airbnb",
  "Twitter",
  "LinkedIn",
  "Infosys",
  "TCS",
  "Wipro",
  "HCL Technologies",
  "Tech Mahindra",
  "Accenture",
  "IBM",
  "Cognizant",
  "Capgemini",
  "Deloitte",
  "Flipkart",
  "Zomato",
  "Swiggy",
  "Paytm",
  "BYJU'S",
  "Razorpay",
  "CRED",
  "PhonePe",
  "Ola",
  "Meesho",
  "Startup",
  "Freelance",
  "Self Employed",
];

const months = [
  { label: "Jan", value: "01" },
  { label: "Feb", value: "02" },
  { label: "Mar", value: "03" },
  { label: "Apr", value: "04" },
  { label: "May", value: "05" },
  { label: "Jun", value: "06" },
  { label: "Jul", value: "07" },
  { label: "Aug", value: "08" },
  { label: "Sep", value: "09" },
  { label: "Oct", value: "10" },
  { label: "Nov", value: "11" },
  { label: "Dec", value: "12" },
];
const years = Array.from({ length: 30 }, (_, i) => (2025 - i).toString());

// ─── Search Modal ───────────────────────────────────────────────
interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  suggestions: string[];
  placeholder: string;
}

const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
  onSelect,
  suggestions,
  placeholder,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!visible) setQuery("");
  }, [visible]);

  const filtered = query.trim()
    ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <SafeAreaView style={modalStyles.container}>
        <StatusBar backgroundColor="#e8f5f2" barStyle="dark-content" />

        {/* Search Bar */}
        <View style={modalStyles.searchRow}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#555"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={modalStyles.searchInput}
            placeholder={placeholder}
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
          <TouchableOpacity onPress={onClose}>
            <Text style={modalStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={modalStyles.divider} />

        {/* Empty State */}
        {query.trim() === "" && (
          <View style={modalStyles.emptyState}>
            <Text style={modalStyles.emptyTitle}>
              Start typing to search for{"\n"}your {placeholder.toLowerCase()}.
            </Text>
            <Text style={modalStyles.emptySubtitle}>
              This will help us provide you with{"\n"}relevant content.
            </Text>
          </View>
        )}

        {/* Results */}
        {query.trim().length > 0 && (
          <ScrollView
            style={modalStyles.results}
            keyboardShouldPersistTaps="handled"
          >
            {/* CUSTOM */}
            <Text style={modalStyles.sectionHeader}>CUSTOM</Text>
            <TouchableOpacity
              style={modalStyles.resultRow}
              onPress={() => handleSelect(query)}
            >
              <Text style={modalStyles.resultText}>{query}</Text>
            </TouchableOpacity>

            {/* SUGGESTIONS */}
            {filtered.length > 0 && (
              <>
                <Text style={modalStyles.sectionHeader}>SUGGESTIONS</Text>
                {filtered.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={modalStyles.resultRow}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={modalStyles.resultText}>{item}</Text>
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

// ─── Date Picker Modal ──────────────────────────────────────────
interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (month: string, year: string) => void;
  initialMonth?: string;
  initialYear?: string;
  title: string;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialMonth = "",
  initialYear = "",
  title,
}) => {
  const [tab, setTab] = useState<"month" | "year">("month");
  const [selMonth, setSelMonth] = useState(initialMonth);
  const [selYear, setSelYear] = useState(initialYear);

  useEffect(() => {
    if (visible) {
      setSelMonth(initialMonth);
      setSelYear(initialYear);
      setTab("month");
    }
  }, [visible]);

  const preview =
    selMonth && selYear
      ? `${months.find((m) => m.value === selMonth)?.label} ${selYear}`
      : selMonth
        ? `${months.find((m) => m.value === selMonth)?.label} —`
        : selYear
          ? `— ${selYear}`
          : "Select month and year";

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={dateStyles.overlay}>
        <View style={dateStyles.sheet}>
          <Text style={dateStyles.title}>{title}</Text>

          {/* Tabs */}
          <View style={dateStyles.tabRow}>
            {(["month", "year"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[dateStyles.tab, tab === t && dateStyles.tabActive]}
                onPress={() => setTab(t)}
              >
                <Text
                  style={[
                    dateStyles.tabText,
                    tab === t && dateStyles.tabTextActive,
                  ]}
                >
                  {t === "month" ? "Month" : "Year"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Month Grid */}
          {tab === "month" && (
            <View style={dateStyles.grid}>
              {months.map((m) => (
                <TouchableOpacity
                  key={m.value}
                  style={[
                    dateStyles.gridItem,
                    selMonth === m.value && dateStyles.gridItemActive,
                  ]}
                  onPress={() => {
                    setSelMonth(m.value);
                    setTab("year");
                  }}
                >
                  <Text
                    style={[
                      dateStyles.gridText,
                      selMonth === m.value && dateStyles.gridTextActive,
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Year List */}
          {tab === "year" && (
            <ScrollView
              style={{ maxHeight: 220 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={dateStyles.grid}>
                {years.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      dateStyles.gridItem,
                      selYear === item && dateStyles.gridItemActive,
                    ]}
                    onPress={() => setSelYear(item)}
                  >
                    <Text
                      style={[
                        dateStyles.gridText,
                        selYear === item && dateStyles.gridTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Preview */}
          <Text style={dateStyles.preview}>{preview}</Text>

          {/* Buttons */}
          <View style={dateStyles.btnRow}>
            <TouchableOpacity style={dateStyles.cancelBtn} onPress={onClose}>
              <Text style={dateStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                dateStyles.confirmBtn,
                (!selMonth || !selYear) && { opacity: 0.5 },
              ]}
              onPress={() => {
                onConfirm(selMonth, selYear);
                onClose();
              }}
              disabled={!selMonth || !selYear}
            >
              <Text style={dateStyles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Main Component ─────────────────────────────────────────────
const WorkExperienceStep: React.FC<WorkExperienceStepProps> = ({
  data,
  addExperience,
  updateExperience,
  removeExperience,
  activeExperienceIndex,
  nextStep,
  prevStep,
  step,
  totalSteps,
}) => {
  const workExperience = data.work_experience || [];

  useEffect(() => {
    if (workExperience.length === 0) {
      addExperience({
        job_title: "",
        company_name: "",
        city: "",
        country: "",
        start_month: "",
        start_year: "",
        end_month: "",
        end_year: "",
        is_present: false,
        description: "",
      });
    }
  }, []);

  const safeIndex = Math.min(
    Math.max(0, activeExperienceIndex),
    Math.max(0, workExperience.length - 1)
  );
  const exp = workExperience[safeIndex] || {};

  // Add local state for immediate display
  const [startMonth, setStartMonth] = useState(exp.start_month || "");
  const [startYear, setStartYear] = useState(exp.start_year || "");
  const [endMonth, setEndMonth] = useState(exp.end_month || "");
  const [endYear, setEndYear] = useState(exp.end_year || "");

  // Helper
  const getDateLabel = (month: string, year: string) => {
    if (!month || !year) return "";
    const monthObj = months.find((m) => m.value === month);
    return monthObj ? `${monthObj.label} ${year}` : `${month}/${year}`;
  };

  const startLabel = getDateLabel(startMonth, startYear);
  const endLabel = getDateLabel(endMonth, endYear);

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isPresent, setIsPresent] = useState<boolean>(exp.is_present || false);

  // When switching which entry we edit, sync date fields from form data
  useEffect(() => {
    const w = workExperience[safeIndex];
    if (!w) return;
    setStartMonth(w.start_month || "");
    setStartYear(w.start_year || "");
    setEndMonth(w.end_month || "");
    setEndYear(w.end_year || "");
    setIsPresent(Boolean(w.is_present));
  }, [safeIndex, workExperience.length]);

  // Modal visibility
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const update = (field: string, value: any) =>
    updateExperience(safeIndex, field, value);

  const renderTextField = (label: string, key: string) => {
    const value = exp[key] || "";
    const isFocused = focusedField === key;
    return (
      <View style={styles.fieldContainer}>
        {value ? (
          <Text style={styles.floatingLabel}>{label.toUpperCase()}</Text>
        ) : null}
        <View style={styles.fieldRow}>
          <TextInput
            style={styles.fieldInput}
            placeholder={label}
            placeholderTextColor="#aaa"
            value={value}
            onFocus={() => setFocusedField(key)}
            onBlur={() => setFocusedField(null)}
            onChangeText={(val) => update(key, val)}
          />
          {value ? (
            <Ionicons name="checkmark" size={20} color="#3BBFAD" />
          ) : null}
        </View>
        <View
          style={[styles.underline, isFocused && styles.underlineFocused]}
        />
      </View>
    );
  };

  // Tappable search field (Job Title, Company)
  const renderSearchField = (
    label: string,
    key: string,
    onPress: () => void,
  ) => {
    const value = exp[key] || "";
    return (
      <TouchableOpacity
        style={styles.fieldContainer}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {value ? (
          <Text style={styles.floatingLabel}>{label.toUpperCase()}</Text>
        ) : null}
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldInput, !value && { color: "#aaa" }]}>
            {value || label}
          </Text>
          <Ionicons
            name={value ? "checkmark" : "search-outline"}
            size={20}
            color={value ? "#3BBFAD" : "#aaa"}
          />
        </View>
        <View style={styles.underline} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Navbar ── */}
      <StatusBar barStyle={"dark-content"} />
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
      >
        <Text style={styles.mainHeading}>
          Tell us about your most recent job
        </Text>
        <Text style={styles.subHeading}>
          {`We'll start there and work backward.`}
        </Text>

        {/* Job Title — opens modal */}
        {renderSearchField("Job title", "job_title", () =>
          setShowJobModal(true),
        )}

        {/* Company Name — opens modal */}
        {renderSearchField("Company name", "company_name", () =>
          setShowCompanyModal(true),
        )}

        {/* City & Country */}
        {/* {renderTextField("City", "city")} */}
        {renderTextField("Country", "country")}

        {/* Date Row */}
        <View style={styles.dateRow}>
          {/* Start Date */}
          {/* Start Date */}
          <TouchableOpacity
            style={styles.dateBlock}
            onPress={() => setShowStartDate(true)}
          >
            {startLabel ? (
              <Text style={styles.floatingLabel}>START DATE</Text>
            ) : null}
            <View style={styles.fieldRow}>
              <Text
                style={[styles.fieldInput, !startLabel && { color: "#aaa" }]}
              >
                {startLabel || "Start date"} {/* ✅ reads from local state */}
              </Text>
              <Ionicons
                name={startLabel ? "checkmark-circle" : "calendar-outline"}
                size={18}
                color={startLabel ? "#3BBFAD" : "#aaa"}
              />
            </View>
            <View style={styles.underline} />
          </TouchableOpacity>

          {/* End Date */}
          <TouchableOpacity
            style={[styles.dateBlock, isPresent && { opacity: 0.4 }]}
            onPress={() => !isPresent && setShowEndDate(true)}
            disabled={isPresent}
          >
            {endLabel && !isPresent ? (
              <Text style={styles.floatingLabel}>END DATE</Text>
            ) : null}
            <View style={styles.fieldRow}>
              <Text
                style={[
                  styles.fieldInput,
                  (!endLabel || isPresent) && { color: "#aaa" },
                ]}
              >
                {isPresent ? "End date" : endLabel || "End date"}{" "}
                {/* ✅ reads from local state */}
              </Text>
              <Ionicons
                name={
                  endLabel && !isPresent
                    ? "checkmark-circle"
                    : "calendar-outline"
                }
                size={18}
                color={endLabel && !isPresent ? "#3BBFAD" : "#aaa"}
              />
            </View>
            <View style={styles.underline} />
          </TouchableOpacity>
        </View>

        {/* Present Checkbox */}
        <View style={styles.presentRow}>
          <TouchableOpacity
            style={[styles.checkbox, isPresent && styles.checkboxActive]}
            onPress={() => {
              const next = !isPresent;
              setIsPresent(next);
              if (next) {
                setEndMonth(""); // ✅ clear local state too
                setEndYear("");
                update("end_month", "");
                update("end_year", "");
              }
              update("is_present", next);
            }}
          >
            {isPresent && <Ionicons name="checkmark" size={14} color="#fff" />}
          </TouchableOpacity>
          <Text style={styles.presentText}>Present</Text>
        </View>
      </ScrollView>

      {/* Continue */}
      <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
        <Text style={styles.continueText}>CONTINUE</Text>
      </TouchableOpacity>

      {/* ── Modals ── */}
      <SearchModal
        visible={showJobModal}
        onClose={() => setShowJobModal(false)}
        onSelect={(val) => update("job_title", val)}
        suggestions={jobTitleSuggestions}
        placeholder="Search by keyword or job title"
      />

      <SearchModal
        visible={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        onSelect={(val) => update("company_name", val)}
        suggestions={companySuggestions}
        placeholder="Search by company name"
      />

      <DatePickerModal
        visible={showStartDate}
        onClose={() => setShowStartDate(false)}
        onConfirm={(m, y) => {
          setStartMonth(m); // ✅ local state updates immediately for display
          setStartYear(y);
          update("start_month", m); // ✅ also persist to formData
          update("start_year", y);
        }}
        initialMonth={startMonth}
        initialYear={startYear}
        title="Select Start Date"
      />

      <DatePickerModal
        visible={showEndDate}
        onClose={() => setShowEndDate(false)}
        onConfirm={(m, y) => {
          setEndMonth(m); // ✅ local state updates immediately for display
          setEndYear(y);
          update("end_month", m);
          update("end_year", y);
        }}
        initialMonth={endMonth}
        initialYear={endYear}
        title="Select End Date"
      />
    </View>
  );
};

export default WorkExperienceStep;

// ─── Styles ─────────────────────────────────────────────────────
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

  fieldContainer: { marginTop: 20 },
  floatingLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#3D405B",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fieldRow: { flexDirection: "row", alignItems: "center" },
  fieldInput: {
    flex: 1,
    fontSize: 16,
    color: "#3D405B",
    paddingVertical: 6,
    fontFamily: "WorkSansRegular",
  },
  underline: { height: 1, backgroundColor: "#ddd", marginTop: 4 },
  underlineFocused: { height: 1.5, backgroundColor: "#3BBFAD" },

  dateRow: { flexDirection: "row", gap: 16, marginTop: 20 },
  dateBlock: { flex: 1 },

  presentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: "#aaa",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: { backgroundColor: "#3BBFAD", borderColor: "#3BBFAD" },
  presentText: {
    fontSize: 15,
    color: "#3D405B",
    fontFamily: "WorkSansRegular",
  },

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

const modalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8f5f2", paddingTop: 20 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#e8f5f2",
    // marginTop:20
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
  results: { backgroundColor: "#fff", flex: 1 },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "bold",
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

const dateStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#3D405B",
    marginBottom: 16,
    textAlign: "center",
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  tabActive: { backgroundColor: "#3BBFAD" },
  tabText: { color: "#888", fontFamily: "WorkSansRegular" },
  tabTextActive: { color: "#fff", fontFamily: "WorkSansBold" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  gridItem: {
    width: "30%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginBottom: 8,
  },
  gridItemActive: { backgroundColor: "#3BBFAD" },
  gridText: { fontSize: 15, color: "#555" },
  gridTextActive: { color: "#fff", fontWeight: "bold" },
  preview: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
    color: "#3D405B",
  },
  btnRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  cancelText: { color: "#888" },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: "#3BBFAD",
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontWeight: "bold" },
});
