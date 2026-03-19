import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  data: any;
  addEducation: (edu: any) => void;
  updateEducation: (
    index: number,
    field: string | Record<string, string>,
    value?: string
  ) => void;
  removeEducationExperience: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  step: number;
  totalSteps: number;
}

const monthsList = [
  { label: "January",   value: "01" },
  { label: "February",  value: "02" },
  { label: "March",     value: "03" },
  { label: "April",     value: "04" },
  { label: "May",       value: "05" },
  { label: "June",      value: "06" },
  { label: "July",      value: "07" },
  { label: "August",    value: "08" },
  { label: "September", value: "09" },
  { label: "October",   value: "10" },
  { label: "November",  value: "11" },
  { label: "December",  value: "12" },
];

const yearsList = Array.from({ length: 52 }, (_, i) =>
  (2036 - i).toString()
);

// ─── Date Picker Modal ───────────────────────────────────────────
interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (month: string, year: string) => void;
  initialMonth?: string;
  initialYear?: string;
  title: string;
}

const DatePickerModal: React.FC<DatePickerProps> = ({
  visible, onClose, onConfirm, initialMonth = "", initialYear = "", title,
}) => {
  const [tab, setTab] = useState<"month" | "year">("month");
  const [selMonth, setSelMonth] = useState(initialMonth);
  const [selYear, setSelYear] = useState(initialYear);

  React.useEffect(() => {
    if (visible) {
      setSelMonth(initialMonth);
      setSelYear(initialYear);
      setTab("month");
    }
  }, [visible]);

  const monthLabel = monthsList.find((m) => m.value === selMonth)?.label;
  const preview =
    selMonth && selYear
      ? `${monthLabel} ${selYear}`
      : selMonth
      ? `${monthLabel} —`
      : selYear
      ? `— ${selYear}`
      : "Select month and year";

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={dpStyles.overlay}>
        <View style={dpStyles.sheet}>
          <Text style={dpStyles.title}>{title}</Text>

          {/* Tabs */}
          <View style={dpStyles.tabRow}>
            {(["month", "year"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[dpStyles.tab, tab === t && dpStyles.tabActive]}
                onPress={() => setTab(t)}
              >
                <Text style={[dpStyles.tabText, tab === t && dpStyles.tabTextActive]}>
                  {t === "month" ? "Month" : "Year"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Month Grid */}
          {tab === "month" && (
            <View style={dpStyles.grid}>
              {monthsList.map((m) => (
                <TouchableOpacity
                  key={m.value}
                  style={[dpStyles.gridItem, selMonth === m.value && dpStyles.gridItemActive]}
                  onPress={() => { setSelMonth(m.value); setTab("year"); }}
                >
                  <Text style={[dpStyles.gridText, selMonth === m.value && dpStyles.gridTextActive]}>
                    {m.label.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Year Grid */}
          {tab === "year" && (
            <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
              <View style={dpStyles.grid}>
                {yearsList.map((y) => (
                  <TouchableOpacity
                    key={y}
                    style={[dpStyles.gridItem, selYear === y && dpStyles.gridItemActive]}
                    onPress={() => setSelYear(y)}
                  >
                    <Text style={[dpStyles.gridText, selYear === y && dpStyles.gridTextActive]}>
                      {y}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Preview */}
          <Text style={dpStyles.preview}>{preview}</Text>

          {/* Buttons */}
          <View style={dpStyles.btnRow}>
            <TouchableOpacity style={dpStyles.cancelBtn} onPress={onClose}>
              <Text style={dpStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[dpStyles.confirmBtn, (!selMonth || !selYear) && { opacity: 0.4 }]}
              onPress={() => { onConfirm(selMonth, selYear); onClose(); }}
              disabled={!selMonth || !selYear}
            >
              <Text style={dpStyles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Main Component ──────────────────────────────────────────────
const EducationStep: React.FC<Props> = ({
  data, addEducation, updateEducation,
  removeEducationExperience, nextStep, prevStep, step, totalSteps,
}) => {
  const edu = data.education?.[0] || {};

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isPresent, setIsPresent] = useState<boolean>(false);

  // Local date state for immediate display
  const [startMonth, setStartMonth] = useState(edu.start_month || "");
  const [startYear,  setStartYear]  = useState(edu.start_year  || "");
  const [endMonth,   setEndMonth]   = useState(edu.end_month   || "");
  const [endYear,    setEndYear]    = useState(edu.end_year    || "");

  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate,   setShowEndDate]   = useState(false);

  const update = (field: string, value: string) =>
    updateEducation(0, field, value);

  const getDateLabel = (month: string, year: string) => {
    if (!month || !year) return "";
    const m = monthsList.find((mo) => mo.value === month);
    return m ? `${m.label.slice(0, 3)} ${year}` : `${month}/${year}`;
  };

  const startLabel = getDateLabel(startMonth, startYear);
  const endLabel   = getDateLabel(endMonth,   endYear);

  // ── Field renderer ──
  const renderField = (label: string, key: string) => {
    const value = edu[key] || "";
    const isFocused = focusedField === key;

    return (
      <View style={styles.fieldContainer}>
        {(value || isFocused) && (
          <Text style={styles.floatingLabel}>{label.toUpperCase()}</Text>
        )}
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
          {value && (
            <Ionicons name="checkmark-circle" size={20} color="#3BBFAD" />
          )}
        </View>
        <View style={[styles.underline, isFocused && styles.underlineFocused]} />
      </View>
    );
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
          <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
          <Text style={styles.navTitle}>EDUCATION</Text>
        </View>
        <TouchableOpacity style={styles.rightBtn}>
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Heading */}
        <Text style={styles.mainHeading}>Tell us about your education</Text>
        <Text style={styles.subHeading}>
          {`Include every school, even if you're still there or didn't graduate`}
        </Text>

        {/* Fields */}
        <View style={styles.fieldsBlock}>
          {renderField("Institution", "institution")}
          {renderField("Degree", "degree")}
          {renderField("Result / CGPA", "result")}
        </View>

        {/* ── Start Date ── full-width top/bottom borders */}
        <View style={styles.dateSectionWrapper}>
          <Text style={styles.dateSectionTitle}>START DATE</Text>
          <TouchableOpacity
            style={styles.datePickerRow}
            onPress={() => setShowStartDate(true)}
          >
            <View style={styles.dateValueBlock}>
              {startLabel ? (
                <Text style={styles.dateValue}>{startLabel}</Text>
              ) : (
                <Text style={styles.datePlaceholder}>Select start date</Text>
              )}
            </View>
            <Ionicons
              name={startLabel ? "checkmark-circle" : "calendar-outline"}
              size={20}
              color={startLabel ? "#3BBFAD" : "#aaa"}
            />
          </TouchableOpacity>
        </View>

        {/* ── Graduation Date ── */}
        <View style={[styles.dateSectionWrapper, isPresent && styles.dateSectionDisabled]}>
          <Text style={styles.dateSectionTitle}>GRADUATION DATE</Text>
          <TouchableOpacity
            style={styles.datePickerRow}
            onPress={() => !isPresent && setShowEndDate(true)}
            disabled={isPresent}
          >
            <View style={styles.dateValueBlock}>
              {isPresent ? (
                <Text style={styles.datePresent}>Present</Text>
              ) : endLabel ? (
                <Text style={styles.dateValue}>{endLabel}</Text>
              ) : (
                <Text style={styles.datePlaceholder}>Select graduation date</Text>
              )}
            </View>
            <Ionicons
              name={endLabel && !isPresent ? "checkmark-circle" : "calendar-outline"}
              size={20}
              color={endLabel && !isPresent ? "#3BBFAD" : "#aaa"}
            />
          </TouchableOpacity>
        </View>

        {/* ── Present Checkbox ── */}
        <View style={styles.presentRow}>
          <TouchableOpacity
            style={[styles.checkbox, isPresent && styles.checkboxActive]}
            onPress={() => {
              const next = !isPresent;
              setIsPresent(next);
              if (next) {
                setEndMonth("");
                setEndYear("");
                update("end_month", "");
                update("end_year", "");
              }
            }}
          >
            {isPresent && <Ionicons name="checkmark" size={14} color="#fff" />}
          </TouchableOpacity>
          <Text style={styles.presentText}>Currently studying here</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Continue ── */}
      <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
        <Text style={styles.continueText}>CONTINUE</Text>
      </TouchableOpacity>

      {/* ── Date Pickers ── */}
      <DatePickerModal
        visible={showStartDate}
        onClose={() => setShowStartDate(false)}
        title="Select Start Date"
        initialMonth={startMonth}
        initialYear={startYear}
        onConfirm={(m, y) => {
          setStartMonth(m);
          setStartYear(y);
          update("start_month", m);
          update("start_year", y);
        }}
      />

      <DatePickerModal
        visible={showEndDate}
        onClose={() => setShowEndDate(false)}
        title="Select Graduation Date"
        initialMonth={endMonth}
        initialYear={endYear}
        onConfirm={(m, y) => {
          setEndMonth(m);
          setEndYear(y);
          update("end_month", m);
          update("end_year", y);
        }}
      />
    </View>
  );
};

export default EducationStep;

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
  leftIcon:     { position: "absolute", left: 20 },
  rightBtn:     { position: "absolute", right: 20 },
  centerContent:{ flex: 1, alignItems: "center" },
  stepText:     { fontSize: 11, color: "#3D405B", fontFamily: "WorkSansRegular" },
  navTitle:     { fontSize: 14, fontWeight: "bold", letterSpacing: 1, color: "#3D405B", fontFamily: "WorkSansBold" },
  previewText:  { color: "#3BBFAD", fontSize: 15, fontFamily: "WorkSansSemiBold" },

  scrollContent: { paddingBottom: 100 },

  mainHeading: {
    marginTop: 24,
    fontSize: 30,
    color: "#3D405B",
    fontFamily: "PlayfairDisplayBold",
    lineHeight: 38,
    paddingHorizontal: 20,
  },
  subHeading: {
    marginTop: 8,
    fontSize: 14,
    color: "#888",
    fontFamily: "WorkSansRegular",
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  // Fields block
  fieldsBlock: { paddingHorizontal: 20 },
  fieldContainer: { marginBottom: 20 },
  floatingLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#3D405B",
    letterSpacing: 0.5,
    marginBottom: 2,
    fontFamily: "WorkSansSemiBold",
  },
  fieldRow:   { flexDirection: "row", alignItems: "center" },
  fieldInput: { flex: 1, fontSize: 16, color: "#3D405B", paddingVertical: 8, fontFamily: "WorkSansRegular" },
  underline:        { height: 1,   backgroundColor: "#ddd", marginTop: 2 },
  underlineFocused: { height: 1.5, backgroundColor: "#3BBFAD" },

  // ── Date sections — full width top/bottom borders ──
  dateSectionWrapper: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 2,
  },
  dateSectionDisabled: { opacity: 0.4 },
  dateSectionTitle: {
    fontSize: 10,
    fontFamily: "WorkSansBold",
    color: "#3D405B",
    letterSpacing: 1,
    marginBottom: 8,
  },
  datePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateValueBlock: { flex: 1 },
  dateValue:       { fontSize: 16, color: "#3D405B", fontFamily: "WorkSansRegular" },
  datePlaceholder: { fontSize: 16, color: "#bbb",    fontFamily: "WorkSansRegular" },
  datePresent:     { fontSize: 16, color: "#3BBFAD", fontFamily: "WorkSansSemiBold" },

  // Present checkbox
  presentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginTop: 14,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#3BBFAD",
    borderColor: "#3BBFAD",
  },
  presentText: {
    fontSize: 14,
    color: "#3D405B",
    fontFamily: "WorkSansRegular",
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

// ─── DatePicker Styles ───────────────────────────────────────────
const dpStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#3D405B",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "WorkSansBold",
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  tab:           { flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: "#f5f5f5" },
  tabActive:     { backgroundColor: "#3BBFAD" },
  tabText:       { color: "#888", fontFamily: "WorkSansRegular", fontSize: 14 },
  tabTextActive: { color: "#fff", fontFamily: "WorkSansBold" },

  // Grid for both months and years
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  gridItem: {
    width: "30%",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginBottom: 4,
  },
  gridItemActive: { backgroundColor: "#3BBFAD" },
  gridText:       { fontSize: 14, color: "#555", fontFamily: "WorkSansRegular" },
  gridTextActive: { color: "#fff", fontWeight: "bold", fontFamily: "WorkSansBold" },

  preview: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 14,
    color: "#3D405B",
    fontFamily: "WorkSansSemiBold",
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
  cancelText: { color: "#888", fontFamily: "WorkSansSemiBold" },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: "#3BBFAD",
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontWeight: "bold", fontFamily: "WorkSansBold" },
});