import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ProjectEntry = { exp: any; index: number };

interface Props {
  data: any;
  projects: any[];
  visibleEntries: ProjectEntry[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onAddAnother: () => void;
  onPreview:() => void;
  nextStep: () => void;
  prevStep: () => void;
  step: number;
  totalSteps: number;
}

const ProjectsSummaryStep: React.FC<Props> = ({
  projects,
  visibleEntries,
  onEdit,
  onDelete,
  onAddAnother,
  onPreview,
  nextStep,
  prevStep,
  step,
  totalSteps,
}) => {
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const backdropAnim = React.useRef(new Animated.Value(0)).current;
  const sheetAnim = React.useRef(new Animated.Value(200)).current;

  const openActionSheet = (index: number) => {
    setSelectedIndex(index);
    setActionSheetVisible(true);
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeActionSheet = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: 200,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActionSheetVisible(false);
      setSelectedIndex(null);
    });
  };

  const handleEdit = () => {
    const idx = selectedIndex;
    closeActionSheet();
    if (idx === null) return;
    // Small delay so modal animation finishes smoothly.
    setTimeout(() => onEdit(idx), 250);
  };

  const handleDelete = () => {
    if (selectedIndex !== null) {
      onDelete(selectedIndex);
    }
    closeActionSheet();
  };

  const truncate = (text: string, max: number) =>
    text?.length > max ? text.slice(0, max) + "..." : text || "";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Navbar ── */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={prevStep} style={styles.leftIcon}>
          <Ionicons name="arrow-back" size={22} color="#3D405B" />
        </TouchableOpacity>
        <View style={styles.centerContent}>
          <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
          <Text style={styles.navTitle}>PROJECTS HISTORY</Text>
        </View>
        <TouchableOpacity style={styles.rightBtn} onPress={onPreview}>
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Heading */}
        <Text style={styles.mainHeading}>Project summary</Text>
        {visibleEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="build-outline" size={40} color="#ccc" />
            <Text style={styles.emptyTitle}>No projects added</Text>
            <Text style={styles.emptySubtitle}>Go back and add projects</Text>
          </View>
        ) : (
          visibleEntries.map(({ exp, index }: ProjectEntry) => {
            const title = (exp?.title || "").trim();
            const technologies = (exp?.technologies || "").trim();
            const liveUrl = (exp?.liveUrl || "").trim();
            const metaParts = [truncate(technologies, 28), liveUrl].filter(Boolean);

            return (
              <View key={`proj-${index}`} style={styles.projectCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={styles.cardDot} />
                    <View style={{ flex: 1 }}>
                      <View style={styles.titleRow}>
                        <Text style={styles.projectTitle} numberOfLines={1}>
                          {title || "Untitled project"}
                        </Text>
                      </View>
                      {metaParts.length > 0 && (
                        <Text style={styles.metaLine} numberOfLines={1}>
                          {metaParts.join(" | ")}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* 3 dots menu */}

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

                <View style={styles.cardBody}>
                  <Text style={styles.descPreview} numberOfLines={3}>
                    {(exp?.description || "").trim()}
                  </Text>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
        {/* Add another */}
        <TouchableOpacity
          style={styles.addPositionBtn}
          onPress={onAddAnother}
          activeOpacity={0.8}
        >
            <View style={styles.addBtnIcon}>
              <Ionicons name="add" size={20} color="#3BBFAD" />
            </View>
          {/* <Ionicons name="add" size={16} color="#3BBFAD" /> */}
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
            style={[styles.actionSheet, { transform: [{ translateY: sheetAnim }] }]}
          >
            <View style={styles.sheetHandle} />

            {selectedIndex !== null && projects[selectedIndex] && (
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle} numberOfLines={1}>
                  {projects[selectedIndex]?.title?.trim() ||
                    projects[selectedIndex]?.technologies?.trim() ||
                    "Work Experience"}
                </Text>
                <Text style={styles.sheetSubtitle} numberOfLines={1}>
                  {projects[selectedIndex]?.liveUrl || ""}
                </Text>
              </View>
            )}

            <View style={styles.sheetDivider} />

            <TouchableOpacity
              style={styles.sheetAction}
              onPress={handleEdit}
              activeOpacity={0.7}
            >
              <View style={[styles.sheetActionIcon, { backgroundColor: "#e8f5f2" }]}>
                <Ionicons name="pencil-outline" size={18} color="#3BBFAD" />
              </View>
              <Text style={styles.sheetActionText}>Edit</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color="#ccc"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetAction}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <View style={[styles.sheetActionIcon, { backgroundColor: "#fff5f5" }]}>
                <Ionicons name="trash-outline" size={18} color="#e07070" />
              </View>
              <Text style={[styles.sheetActionText, { color: "#e07070" }]}>
                Delete
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color="#ccc"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>

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

export default ProjectsSummaryStep;

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
  navTitle: { fontSize: 14,letterSpacing: 1, color: "#3D405B", fontFamily: "WorkSansBold" },
  previewText: { color: "#3BBFAD", fontSize: 15, fontFamily: "WorkSansSemiBold" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 },
  mainHeading: {
    fontSize: 28,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
    marginBottom: 24,
    lineHeight: 36,
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
  emptyState: {
    alignItems: "center",
    justifyContent:"center",
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
    textAlign: "center",
  },

  projectCard: {
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
    gap: 10,
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
    marginBottom: 5,
  },
  projectTitle: {
    fontSize: 15,
    fontFamily: "WorkSansBold",
    color: "#3D405B",
    flexShrink: 1,
    maxWidth: "100%",
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
  cardBody: { padding: 16, paddingTop: 12 },
  descPreview: {
    fontSize: 13,
    fontFamily: "WorkSansRegular",
    color: "#888",
    lineHeight: 18,
  },

  addPositionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    // marginBottom: 100,
    // paddingVertical: 16,
    // borderWidth: 1.5,
    // borderColor: "#3BBFAD",
    // borderStyle: "dashed",
    // borderRadius: 14,
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
    fontSize: 15,
    color: "#3BBFAD",
    fontFamily: "WorkSansSemiBold",
    // textTransform:"uppercase"
  },

  // Action sheet
  modalRoot: { flex: 1, justifyContent: "flex-end" },
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
  sheetHeader: { paddingHorizontal: 20, marginBottom: 14 },
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

