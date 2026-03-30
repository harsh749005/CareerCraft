// components/ResumePreviewCard.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { Resume } from "../../types/resume";
import { template as template1 } from "@/components/TemplateDesign/template1";
import { template as template2 } from "@/components/TemplateDesign/template2";
import { resolvePdfLayoutFromTemplateId } from "@/config/templateConfig";
import { fillTemplate } from "../appcomp/FillTemplate";
import { fillTemplate2 } from "../appcomp/FillTemplate2";
import { RenameModal, DeleteModal } from "./ResumeActionModal";
import {
  renameResume,
  duplicateResume,
  deleteResume,
  saveResume
} from "../../services/resumeServices";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.72;
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const PREVIEW_HEIGHT = 320;                    // card preview area height
const SCALE = CARD_WIDTH / A4_WIDTH;           // how much to shrink A4 → card
const WEBVIEW_HEIGHT = PREVIEW_HEIGHT / SCALE;
interface Props {
  resume: Resume;
  isSelected: boolean;
  onPress: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onDownload: () => void;
  onDuplicate: (copy: Resume) => void;
  onRename: (id: string, newName: string) => void;
}

export default function ResumePreviewCard({
  resume,
  isSelected,
  onPress,
  onDelete,
  onEdit,
  onDownload,
  onDuplicate,
  onRename,
}: Props) {
  // Replace useState declarations
  const [sheetVisible, setSheetVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [renameValue, setRenameValue] = useState(resume.name);
  const slideAnim = React.useRef(new Animated.Value(400)).current;

  // ── Sheet open/close ──
  const openSheet = () => {
    setSheetVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      damping: 22,
      stiffness: 220,
    }).start();
  };

  const closeSheet = (cb?: () => void) => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSheetVisible(false);
      cb?.();
    });
  };

  // ── Rename handlers ──
  // const handleRenameOpen = () => {
  //   setRenameValue(resume.name);
  //   closeSheet(() => setRenameVisible(true));
  // };

  const handleRenameSave = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed) return;
    await saveResume({ ...resume, name: trimmed });
    onRename(resume.id, trimmed);
    setRenameVisible(false);
  };

  const handleRenameOpen = () => {
    closeSheet(() => setRenameVisible(true));
  };

  const handleDuplicate = async () => {
    closeSheet(async () => {
      const copy = await duplicateResume(resume);
      onDuplicate(copy); // updates index.tsx state
    });
  };

  const handleDelete = () => {
    closeSheet(() => setDeleteVisible(true));
  };
  // ── HTML for WebView ──
  const html = useMemo(() => {
    try {
      const data = resume.data;
      const pdfLayout = resolvePdfLayoutFromTemplateId(data?.selected_template);
      const raw =
        pdfLayout === "modern"
          ? fillTemplate2(template2, data)
          : fillTemplate(template1, data);
  
      const inject = `
        <meta name="viewport" content="width=${A4_WIDTH}" />
        <style>
          * { box-sizing: border-box !important; }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: ${A4_WIDTH}px !important;
            background: #fff !important;
            overflow: hidden !important;
          }
        </style>
      `;
  
      if (raw.includes("</head>")) return raw.replace("</head>", `${inject}</head>`);
      if (raw.includes("<head>"))  return raw.replace("<head>", `<head>${inject}`);
      return `<html><head>${inject}</head><body>${raw}</body></html>`;
    } catch {
      return `<html><body style="font-family:sans-serif;padding:20px;"><p>Preview unavailable</p></body></html>`;
    }
  }, [resume.data]);

  return (
    <>
      {/* ── Card ── */}
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={onPress}
        activeOpacity={0.95}
      >
        {/* Resume WebView Preview */}
        <View style={styles.previewContainer}>
          <View style={styles.scaleOuter}>
            <View style={styles.scaleInner}>
              <WebView
                source={{ html }}
                style={styles.webview}
                originWhitelist={["*"]}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                pointerEvents="none"
              />
            </View>
          </View>

          {/* Tap blocker */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={onPress}
            activeOpacity={1}
          />

          {/* Download overlay */}
          <View style={styles.overlayRow}>
            <TouchableOpacity style={styles.overlayBtn} onPress={onDownload}>
              <Ionicons name="download-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cvName} numberOfLines={1}>
              {resume.name}
            </Text>
            <Text style={styles.cvTime}>{resume.time}</Text>
          </View>
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={openSheet}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="ellipsis-horizontal" size={18} color="#3D405B" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* ── Bottom Sheet ── */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => closeSheet()}
      >
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={() => closeSheet()}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Options — clean text list like the reference image */}
          <TouchableOpacity
            style={styles.sheetRow}
            onPress={() => closeSheet(onDownload)}
            activeOpacity={0.6}
          >
            <Text style={styles.sheetRowText}>Download CV</Text>
          </TouchableOpacity>

          <View style={styles.sheetSep} />

          <TouchableOpacity
            style={styles.sheetRow}
            onPress={() => closeSheet(onEdit)}
            activeOpacity={0.6}
          >
            <Text style={styles.sheetRowText}>Edit</Text>
          </TouchableOpacity>

          <View style={styles.sheetSep} />

          <TouchableOpacity
            style={styles.sheetRow}
            onPress={handleDuplicate}
            activeOpacity={0.6}
          >
            <Text style={styles.sheetRowText}>Duplicate</Text>
          </TouchableOpacity>

          <View style={styles.sheetSep} />

          <TouchableOpacity
            style={styles.sheetRow}
            onPress={handleRenameOpen}
            activeOpacity={0.6}
          >
            <Text style={styles.sheetRowText}>Rename</Text>
          </TouchableOpacity>

          <View style={styles.sheetSep} />

          <TouchableOpacity
            style={styles.sheetRow}
            onPress={handleDelete}
            activeOpacity={0.6}
          >
            <Text style={[styles.sheetRowText, styles.sheetRowDanger]}>
              Delete
            </Text>
          </TouchableOpacity>

          <View style={styles.sheetSep} />

          {/* Cancel */}
          <TouchableOpacity
            style={[styles.sheetRow, styles.sheetCancelRow]}
            onPress={() => closeSheet()}
            activeOpacity={0.6}
          >
            <Text style={styles.sheetCancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>

      {/* ── Rename Modal ── */}
      <RenameModal
        visible={renameVisible}
        currentName={resume.name}
        onSave={async (newName) => {
          setRenameVisible(false);
          await renameResume(resume.id, newName);
          onRename(resume.id, newName); // updates index.tsx state
        }}
        onCancel={() => setRenameVisible(false)}
      />

      <DeleteModal
        visible={deleteVisible}
        resumeName={resume.name}
        onConfirm={async () => {
          setDeleteVisible(false);
          await deleteResume(resume.id);
          onDelete(); // updates index.tsx state
        }}
        onCancel={() => setDeleteVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  // ── Card ──
  card: {
    width: CARD_WIDTH,
    height: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding:5,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#3D405B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  cardSelected: {
    borderColor: "#3BBFAD",
    shadowColor: "#3BBFAD",
    shadowOpacity: 0.25,
  },

  // ── Preview ──
  previewContainer: {
    width: CARD_WIDTH,
    height: PREVIEW_HEIGHT,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  scaleOuter: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CARD_WIDTH,
    height: PREVIEW_HEIGHT,
    overflow: "hidden",
  },
  scaleInner: {
    width: A4_WIDTH,
    height: WEBVIEW_HEIGHT,
    // ✅ Correct way to scale from top-left in React Native
    transform: [
      { translateX: -(A4_WIDTH * (1 - SCALE)) / 2 },
      { translateY: -(WEBVIEW_HEIGHT * (1 - SCALE)) / 2 },
      { scale: SCALE },
    ],
  },
  webview: {
    width: A4_WIDTH,
    height: WEBVIEW_HEIGHT,
    backgroundColor: "#fff",
  },
  overlayRow: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  overlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(61,64,91,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Footer ──
  footer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cvName: {
    fontSize: 14,
    fontFamily: "WorkSansBold",
    color: "#3D405B",
  },
  cvTime: {
    fontSize: 11,
    color: "#aaa",
    fontFamily: "WorkSansRegular",
    marginTop: 2,
  },
  moreBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F4F1DE",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Bottom Sheet ──
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  sheetRow: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  sheetRowText: {
    fontSize: 17,
    fontFamily: "WorkSansRegular",
    color: "#3D405B",
  },
  sheetRowDanger: {
    color: "#e07070",
  },
  sheetSep: {
    height: 1,
    backgroundColor: "#f2f2f2",
    marginHorizontal: 0,
  },
  sheetCancelRow: {
    marginTop: 6,
  },
  sheetCancelText: {
    fontSize: 17,
    fontFamily: "WorkSansRegular",
    color: "#aaa",
  },

  // ── Rename Modal ──
  renameOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 24,
  },
  renameCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  renameTitle: {
    fontSize: 22,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
    marginBottom: 8,
  },
  renameSub: {
    fontSize: 14,
    fontFamily: "WorkSansRegular",
    color: "#888",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 28,
  },
  renameInputBlock: {
    width: "100%",
    marginBottom: 24,
  },
  renameInputLabel: {
    fontSize: 10,
    fontFamily: "WorkSansBold",
    color: "#aaa",
    letterSpacing: 1,
    marginBottom: 8,
  },
  renameInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  renameInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "WorkSansRegular",
    color: "#3D405B",
    paddingVertical: 4,
  },
  renameUnderline: {
    height: 1.5,
    backgroundColor: "#3BBFAD",
    marginTop: 6,
  },
  renameSaveBtn: {
    width: "100%",
    backgroundColor: "#3BBFAD",
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  renameSaveBtnDisabled: {
    backgroundColor: "#b2e2dc",
  },
  renameSaveText: {
    fontSize: 16,
    fontFamily: "WorkSansBold",
    color: "#fff",
  },
  renameCancelBtn: {
    paddingVertical: 8,
  },
  renameCancelText: {
    fontSize: 15,
    fontFamily: "WorkSansRegular",
    color: "#aaa",
  },
});