// components/ResumePreviewModal.tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { template as template1 } from "@/components/TemplateDesign/template1";
import { template as template2 } from "@/components/TemplateDesign/template2";
import { resolvePdfLayoutFromTemplateId } from "@/config/templateConfig";
import { fillTemplate } from "../appcomp/FillTemplate";
import { fillTemplate2 } from "../appcomp/FillTemplate2";

const { width, height } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
  formData: any;
}

export default function ResumePreviewModal({ visible, onClose, formData }: Props) {
  const html = useMemo(() => {
    if (!formData) return "<html><body><p>No data yet.</p></body></html>";
    try {
      const pdfLayout = resolvePdfLayoutFromTemplateId(formData?.selected_template);
      const raw = pdfLayout === "modern"
        ? fillTemplate2(template2, formData)
        : fillTemplate(template1, formData);

      // Inject viewport + disable scroll for modal view
      return raw.replace(
        "<style>",
        `<style>
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
          }
          body {
            margin: 30px 40px !important;
            padding: 0 !important;
          }
        `
      );
    } catch {
      return "<html><body><p>Preview unavailable.</p></body></html>";
    }
  }, [formData]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />
      <View style={styles.container}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#3D405B" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>PREVIEW</Text>
            <Text style={styles.headerSub}>Live resume preview</Text>
          </View>
          {/* Placeholder to balance the close button */}
          <View style={{ width: 36 }} />
        </View>

        {/* ── Draft notice ── */}
        <View style={styles.draftBanner}>
          <Ionicons name="information-circle-outline" size={14} color="#3BBFAD" />
          <Text style={styles.draftBannerText}>
            Showing data filled so far — empty sections are hidden
          </Text>
        </View>

        {/* ── WebView ── */}
        <View style={styles.webviewContainer}>
          <WebView
            source={{ html }}
            style={styles.webview}
            originWhitelist={["*"]}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1DE",
  },

  // Header
  header: {
    height: 56,
    backgroundColor: "#F4F1DE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: { alignItems: "center" },
  headerTitle: {
    fontSize: 14,
    fontFamily: "WorkSansBold",
    color: "#3D405B",
    letterSpacing: 1,
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "WorkSansRegular",
    color: "#888",
    marginTop: 1,
  },

  // Draft banner
  draftBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#e8f5f2",
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c8e8e0",
  },
  draftBannerText: {
    fontSize: 12,
    fontFamily: "WorkSansRegular",
    color: "#3D405B",
    flex: 1,
  },

  // WebView
  webviewContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  webview: {
    flex: 1,
    backgroundColor: "#fff",
  },
});