import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  PanResponder,
  Animated,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { template as template1 } from "@/components/TemplateDesign/template1";
import { template as template2 } from "@/components/TemplateDesign/template2";
import { template as template3 } from "@/components/TemplateDesign/template3";
import { resolvePdfLayoutFromTemplateId } from "@/config/templateConfig";
import { fillTemplate } from "../appcomp/FillTemplate";
import { fillTemplate2 } from "../appcomp/FillTemplate2";
import { fillTemplate3 } from "../appcomp/FillTemplate3";
const { width } = Dimensions.get("window");

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const CARD_WIDTH = width - 24;
const SCALE = CARD_WIDTH / A4_WIDTH_PX;
const SCALED_HEIGHT = A4_HEIGHT_PX * SCALE;

const MIN_ZOOM = 1.0;
const MAX_ZOOM = 3.0;
const ZOOM_STEP = 0.25;

interface Props {
  visible: boolean;
  onClose: () => void;
  formData: any;
}

export default function ResumePreviewModal({ visible, onClose, formData }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const currentScale = useRef(1);
  const currentX = useRef(0);
  const currentY = useRef(0);

  // ✅ useState so label re-renders on change
  const [zoomPercent, setZoomPercent] = useState(100);

  const animateTo = (nextScale: number, resetPosition = false) => {
    currentScale.current = nextScale;
    setZoomPercent(Math.round(nextScale * 100));

    const animations: Animated.CompositeAnimation[] = [
      Animated.spring(scaleAnim, {
        toValue: nextScale,
        useNativeDriver: true,
        damping: 18,
        stiffness: 180,
      }),
    ];

    if (resetPosition) {
      currentX.current = 0;
      currentY.current = 0;
      animations.push(
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 180,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 180,
        })
      );
    }

    Animated.parallel(animations).start();
  };

  const handleZoomIn = () => {
    const next = Math.min(MAX_ZOOM, currentScale.current + ZOOM_STEP);
    animateTo(next);
  };

  const handleZoomOut = () => {
    const next = Math.max(MIN_ZOOM, currentScale.current - ZOOM_STEP);
    animateTo(next, next <= MIN_ZOOM);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) =>
        evt.nativeEvent.touches.length === 1,
      onMoveShouldSetPanResponder: (evt) =>
        evt.nativeEvent.touches.length === 1,
      onPanResponderMove: (_, gestureState) => {
        if (currentScale.current <= MIN_ZOOM) return;
        translateX.setValue(currentX.current + gestureState.dx);
        translateY.setValue(currentY.current + gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (currentScale.current <= MIN_ZOOM) return;
        currentX.current += gestureState.dx;
        currentY.current += gestureState.dy;
      },
    })
  ).current;

  const html = useMemo(() => {
    if (!formData) return "<html><body><p>No data.</p></body></html>";
    try {
      const pdfLayout = resolvePdfLayoutFromTemplateId(formData?.selected_template);
      const raw =
        pdfLayout === "modern"
          ? fillTemplate2(template2, formData)
          : pdfLayout === "classic"
            ? fillTemplate3(template3, formData)
          : fillTemplate(template1, formData);

      const inject = `
        <meta name="viewport" content="width=${A4_WIDTH_PX}, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          * { box-sizing: border-box; touch-action: none; }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: ${A4_WIDTH_PX}px !important;
            background: #fff !important;
            overflow: hidden !important;
          }
          body {
            transform-origin: top left;
            transform: scale(${SCALE});
            margin: 0 !important;
            padding: 0 !important;
          }
        </style>
        <script>
          document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) e.preventDefault();
          }, { passive: false });
          document.addEventListener('touchmove', function(e) {
            e.preventDefault();
          }, { passive: false });
          document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
          }, { passive: false });
        </script>
      `;

      if (raw.includes("</head>")) return raw.replace("</head>", `${inject}</head>`);
      if (raw.includes("<head>")) return raw.replace("<head>", `<head>${inject}`);
      return `<html><head>${inject}</head><body>${raw}</body></html>`;
    } catch {
      return "<html><body><p>Preview unavailable.</p></body></html>";
    }
  }, [formData]);

  const isMinZoom = zoomPercent <= MIN_ZOOM * 100;
  const isMaxZoom = zoomPercent >= MAX_ZOOM * 100;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
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
          <View style={{ width: 36 }} />
        </View>

        {/* ── Draft notice ── */}
        <View style={styles.draftBanner}>
          <Ionicons name="information-circle-outline" size={14} color="#3BBFAD" />
          <Text style={styles.draftBannerText}>
            Showing data filled so far — empty sections are hidden
          </Text>
        </View>

        {/* ── Canvas ── */}
        <View style={styles.canvas} {...panResponder.panHandlers}>
          <Animated.View
            style={{
              transform: [
                { translateX },
                { translateY },
                { scale: scaleAnim },
              ],
            }}
          >
            <View style={styles.paperCard}>
              <WebView
                source={{ html }}
                style={{
                  width: CARD_WIDTH,
                  height: SCALED_HEIGHT,
                  backgroundColor: "#fff",
                }}
                originWhitelist={["*"]}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                scalesPageToFit={false}
              />
            </View>
          </Animated.View>
        </View>

        {/* ── Zoom bar ── */}
        <View style={styles.zoomBar}>

          {/* Zoom out button */}
          <TouchableOpacity
            style={[styles.zoomBtn, isMinZoom && styles.zoomBtnDisabled]}
            onPress={handleZoomOut}
            disabled={isMinZoom}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={20} color={isMinZoom ? "#ccc" : "#3D405B"} />
          </TouchableOpacity>

          {/* Scale label */}
          <View style={styles.zoomIndicator}>
            <Ionicons name="search-outline" size={13} color="#3BBFAD" />
            <Text style={styles.zoomLabel}>{zoomPercent}%</Text>
          </View>

          {/* Zoom in button */}
          <TouchableOpacity
            style={[styles.zoomBtn, isMaxZoom && styles.zoomBtnDisabled]}
            onPress={handleZoomIn}
            disabled={isMaxZoom}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color={isMaxZoom ? "#ccc" : "#3D405B"} />
          </TouchableOpacity>

        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1DE",
    paddingTop: 20,
  },
  header: {
    height: 56,
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
  canvas: {
    flex: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 8,
  },
  paperCard: {
    width: CARD_WIDTH,
    height: SCALED_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },

  // ── Zoom bar ──
  zoomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0ede0",
  },
  zoomBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F4F1DE",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e8e4d0",
  },
  zoomBtnDisabled: {
    opacity: 0.35,
  },
  zoomIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#F4F1DE",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e8e4d0",
    minWidth: 90,
    justifyContent: "center",
  },
  zoomLabel: {
    fontSize: 14,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
});