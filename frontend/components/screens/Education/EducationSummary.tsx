import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type WorkExpEntry = { exp: any; index: number };

function isExperienceVisibleInSummary(exp: any) {
  const t = (exp?.institution || "").trim();
  const c = (exp?.degree || "").trim();
  const d = (exp?.result || "").trim();
  const hasDates =
    Boolean(exp?.start_month) ||
    Boolean(exp?.start_year) ||
    Boolean(exp?.end_month) ||
    Boolean(exp?.end_year) ||
    Boolean(exp?.is_present);
  return Boolean(t || c || d || hasDates);
}

interface Props {
  data: any;
  removeExperience: (index: number) => void;
  onAddAnotherPosition: () => void;
  onEditExperience: (index: number) => void;
  onPreview: () => void;
  // onGoToJobDescription: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  step: number;
  totalSteps: number;
}

const EducationSummary: React.FC<Props> = ({
  data,
  removeExperience,
  onAddAnotherPosition,
  onEditExperience,
  onPreview,
  // onGoToJobDescription,
  nextStep,
  prevStep,
  step,
  totalSteps,
}) => {
  const EducationExperience = data.education || [];
  const visibleEntries: WorkExpEntry[] = EducationExperience
    .map((exp: any, index: number) => ({ exp, index }))
    .filter((entry: WorkExpEntry) =>
      isExperienceVisibleInSummary(entry.exp)
    );

  // ── Action sheet state ──
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const backdropAnim = React.useRef(new Animated.Value(0)).current;
  const sheetAnim = React.useRef(new Animated.Value(200)).current;

  const openActionSheet = (index: number) => {
    setSelectedIndex(index);
    setActionSheetVisible(true);
    Animated.parallel([
      Animated.timing(backdropAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(sheetAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const closeActionSheet = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(sheetAnim, { toValue: 200, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      setActionSheetVisible(false);
      setSelectedIndex(null);
    });
  };

  const handleEdit = () => {
    const idx = selectedIndex;
    closeActionSheet();
    if (idx !== null) {
      setTimeout(() => onEditExperience(idx), 300);
    }
  };

  const handleDelete = () => {
    if (selectedIndex !== null) {
      removeExperience(selectedIndex);
    }
    closeActionSheet();
  };

  const handleAddAnother = () => {
    onAddAnotherPosition();
  };

  // ── Format date helper ──
  const formatDate = (month: string, year: string, isPresent: boolean) => {
    if (isPresent) return "Present";
    if (!month && !year) return "";
    if (!month) return year;
    return `${month}/${year}`;
  };

  // ── Truncate text ──
  const truncate = (text: string, max: number) =>
    text?.length > max ? text.slice(0, max) + "..." : text || "";

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
          <Text style={styles.navTitle}>EDUCATION HISTORY</Text>
        </View>
        <TouchableOpacity style={styles.rightBtn} onPress={onPreview}>
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Heading */}
        <Text style={styles.mainHeading}>Education history summary</Text>

        {/* ── Experience Cards ── */}
        {visibleEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={40} color="#ccc" />
            <Text style={styles.emptyTitle}>No education experience added</Text>
            <Text style={styles.emptySubtitle}>
              Go back and add your Education history
            </Text>
          </View>
        ) : (
          visibleEntries.map(({ exp, index }: WorkExpEntry) => {
            const startDate = formatDate(exp.start_month, exp.start_year, false);
            const endDate = formatDate(exp.end_month, exp.end_year, exp.is_present);
            const location = [exp.city, exp.country].filter(Boolean).join(", ");
            const bullets = exp.description
              ? exp.description.split("\n").filter((b: string) => b.trim())
              : [];

            return (
              <View key={`we-${index}`} style={styles.expCard}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={styles.cardDot} />
                    <View style={{ flex: 1 }}>
                      {/* Job title + Company */}
                      <View style={styles.titleRow}>
                        <Text style={styles.jobTitle} numberOfLines={1}>
                          {exp.institution || "Untitled Role"}
                        </Text>
                        {exp.degree && (
                          <>
                            {/* <Text style={styles.titleSep}> | </Text> */}
                            <Text style={styles.companyName} numberOfLines={1}>
                              {truncate(exp.degree, 10)}
                            </Text>
                          </>
                        )}
                      </View>

                      {/* Date + Location */}
                      <Text style={styles.metaLine} numberOfLines={1}>
                        {[
                          startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate,
                          truncate(location, 14),
                        ].filter(Boolean).join(" | ")}
                      </Text>
                    </View>
                  </View>

                  {/* ✅ 3 dots menu */}
                  <TouchableOpacity
                    style={styles.dotsBtn}
                    onPress={() => openActionSheet(index)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="ellipsis-vertical" size={18} color="#888" />
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.cardDivider} />

                {/* Bullet points */}
                {bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {bullets.map((bullet: string, bi: number) => (
                      <View key={bi} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>
                          {bullet.startsWith("•") ? bullet.slice(1).trim() : bullet}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* No description fallback */}
                {/* {bullets.length === 0 && (
                  <TouchableOpacity
                    style={styles.addDescBtn}
                    onPress={() => onGoToJobDescription(index)}
                  >
                    <Ionicons name="add" size={14} color="#3BBFAD" />
                    <Text style={styles.addDescText}>Add job description</Text>
                  </TouchableOpacity>
                )} */}
              </View>
            );
          })
        )}

        {/* ── Add another position ── */}
        {/* <TouchableOpacity
          style={styles.addPositionBtn}
          onPress={handleAddAnother}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={16} color="#3BBFAD" />
          <Text style={styles.addPositionText}>Add another position</Text>
        </TouchableOpacity> */}

        <View style={{ height: 100 }} />
      </ScrollView>
  {/* ── Add Another Project ── */}
  <TouchableOpacity
            style={styles.addPositionBtn}
            onPress={handleAddAnother}
            activeOpacity={0.8}
          >
            <View style={styles.addBtnIcon}>
              <Ionicons name="add" size={20} color="#3BBFAD" />
            </View>
            <Text style={styles.addPositionText}>ADD ANOTHER PROJECT</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
      {/* ── Continue Button ── */}
      <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
        <Text style={styles.continueText}>CONTINUE</Text>
      </TouchableOpacity>

      {/* ── Action Sheet Modal ── */}
      <Modal
        visible={actionSheetVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeActionSheet}
      >
        <View style={styles.modalRoot}>
          {/* Backdrop */}
          <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
            <TouchableOpacity style={{ flex: 1 }} onPress={closeActionSheet} />
          </Animated.View>

          {/* Sheet */}
          <Animated.View
            style={[
              styles.actionSheet,
              { transform: [{ translateY: sheetAnim }] },
            ]}
          >
            {/* Handle */}
            <View style={styles.sheetHandle} />

            {/* Selected experience label */}
            {selectedIndex !== null && EducationExperience[selectedIndex] && (
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle} numberOfLines={1}>
                  {EducationExperience[selectedIndex]?.institution?.trim() ||
                    EducationExperience[selectedIndex]?.degree?.trim() ||
                    "Education experience"}
                </Text>
                <Text style={styles.sheetSubtitle} numberOfLines={1}>
                  {EducationExperience[selectedIndex]?.degree || ""}
                </Text>
              </View>
            )}

            <View style={styles.sheetDivider} />

            {/* Edit */}
            <TouchableOpacity
              style={styles.sheetAction}
              onPress={handleEdit}
              activeOpacity={0.7}
            >
              <View style={[styles.sheetActionIcon, { backgroundColor: "#e8f5f2" }]}>
                <Ionicons name="pencil-outline" size={18} color="#3BBFAD" />
              </View>
              <Text style={styles.sheetActionText}>Edit</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" style={{ marginLeft: "auto" }} />
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity
              style={styles.sheetAction}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <View style={[styles.sheetActionIcon, { backgroundColor: "#fff5f5" }]}>
                <Ionicons name="trash-outline" size={18} color="#e07070" />
              </View>
              <Text style={[styles.sheetActionText, { color: "#e07070" }]}>Delete</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" style={{ marginLeft: "auto" }} />
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              style={styles.sheetCancel}
              onPress={closeActionSheet}
              activeOpacity={0.7}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default EducationSummary;

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
  navTitle: { fontSize: 14, letterSpacing: 1, color: "#3D405B", fontFamily: "WorkSansBold" },
  previewText: { color: "#3BBFAD", fontSize: 15, fontFamily: "WorkSansSemiBold" },

  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 },

  mainHeading: {
    fontSize: 28,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
    marginBottom: 24,
    lineHeight: 36,
  },

  // Experience card
  expCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: 10,
  },
  cardDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3BBFAD",
    marginTop: 5,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 5,
    gap: 4,
  },
  jobTitle: {
    fontSize: 15,
    fontFamily: "WorkSansBold",
    color: "#3D405B",
    flexShrink: 1,
    maxWidth: "100%",
  },
  titleSep: {
    fontSize: 15,
    color: "#aaa",
    fontFamily: "WorkSansRegular",
  },
  companyName: {
    fontSize: 15,
    fontFamily: "WorkSansRegular",
    color: "#888",
    flexShrink: 1,
    maxWidth: "55%",
  },
  metaLine: {
    fontSize: 13,
    fontFamily: "WorkSansRegular",
    color: "#888",
    lineHeight: 18,
  },
  dotsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  cardDivider: { height: 1, backgroundColor: "#f5f5f5" },

  // Bullets
  bulletList: {
    padding: 16,
    paddingTop: 12,
    gap: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bulletDot: {
    fontSize: 16,
    color: "#3D405B",
    lineHeight: 22,
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "WorkSansRegular",
    color: "#3D405B",
    lineHeight: 22,
  },

  // Add description
  addDescBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 16,
    paddingTop: 12,
  },
  addDescText: {
    fontSize: 13,
    color: "#3BBFAD",
    fontFamily: "WorkSansSemiBold",
  },

  // Add position button
  addPositionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    // marginBottom: 100,
    // flexDirection: "row",
    // alignItems: "center",
    // marginHorizontal: 20,
    // marginBottom: 10,
    // paddingVertical: 14,
    // borderWidth: 1.5,
    // borderColor: "#3BBFAD",
    // borderStyle: "dashed",
    // borderRadius: 14,
    // justifyContent: "center",
    // gap: 8,
    // backgroundColor: "#f9fffe",
  },
  addBtnIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e8f5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  addPositionText: {
 fontSize: 14, color: "#3BBFAD", fontFamily: "WorkSansSemiBold"
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

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 160,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "WorkSansRegular",
    color: "#aaa",
  },

  // ── Action Sheet ──
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  actionSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e0e0e0",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  sheetHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: "WorkSansBold",
    color: "#3D405B",
    marginBottom: 2,
  },
  sheetSubtitle: {
    fontSize: 13,
    fontFamily: "WorkSansRegular",
    color: "#888",
  },
  sheetDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
  },
  sheetAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  sheetActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetActionText: {
    fontSize: 16,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  sheetCancel: {
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#F4F1DE",
    alignItems: "center",
  },
  sheetCancelText: {
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
});