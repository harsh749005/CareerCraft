// // components/ResumePreviewCard.tsx
// import React from "react";
// import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { Resume } from "../../types/resume";

// const CARD_WIDTH = Dimensions.get("window").width * 0.68;

// interface Props {
//   resume: Resume;
//   isSelected: boolean;
//   onPress: () => void;
//   onMorePress: () => void;
// }

// export default function ResumePreviewCard({
//   resume,
//   isSelected,
//   onPress,
//   onMorePress,
// }: Props) {
//   const d = resume.data;
//   const personal = d?.personal_info ?? {};
//   const skills: string[] = [
//     ...Object.values(d?.skills?.categorized ?? {}).flat(),
//     ...(d?.skills?.uncategorized ?? []),
//   ].slice(0, 6) as string[];

//   const workExp = d?.work_experience ?? [];
//   const education = d?.education ?? [];
//   const projects = d?.projects ?? [];

//   // Get initials for avatar
//   const initials = personal.name
//     ? personal.name
//         .split(" ")
//         .slice(0, 2)
//         .map((w: string) => w[0])
//         .join("")
//         .toUpperCase()
//     : "?";

//   return (
//     <TouchableOpacity
//       style={[styles.card, isSelected && styles.cardSelected]}
//       onPress={onPress}
//       activeOpacity={0.9}
//     >
//       {/* ── Mini Resume Body ── */}
//       <View style={styles.resumeBody}>

//         {/* Header strip */}
//         <View style={styles.headerStrip}>
//           <View style={styles.avatarCircle}>
//             <Text style={styles.avatarText}>{initials}</Text>
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.resumeName} numberOfLines={1}>
//               {personal.name || "No Name"}
//             </Text>
//             <Text style={styles.resumeBranch} numberOfLines={1}>
//               {personal.branch || ""}
//             </Text>
//             {personal.email ? (
//               <Text style={styles.resumeContact} numberOfLines={1}>
//                 {personal.email}
//               </Text>
//             ) : null}
//           </View>
//         </View>

//         <View style={styles.divider} />

//         {/* Summary */}
//         {d?.professional_summary ? (
//           <View style={styles.miniSection}>
//             <Text style={styles.miniLabel}>SUMMARY</Text>
//             <Text style={styles.miniBody} numberOfLines={2}>
//               {d.professional_summary}
//             </Text>
//           </View>
//         ) : null}

//         {/* Experience */}
//         {workExp.length > 0 && (
//           <View style={styles.miniSection}>
//             <Text style={styles.miniLabel}>EXPERIENCE</Text>
//             {workExp.slice(0, 2).map((exp: any, i: number) => (
//               <View key={i} style={styles.miniRow}>
//                 <View style={styles.miniDot} />
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.miniTitle} numberOfLines={1}>
//                     {exp.job_title || exp.role || "—"}
//                   </Text>
//                   <Text style={styles.miniSub} numberOfLines={1}>
//                     {exp.company_name || exp.company || ""}
//                   </Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* Education */}
//         {education.length > 0 && (
//           <View style={styles.miniSection}>
//             <Text style={styles.miniLabel}>EDUCATION</Text>
//             {education.slice(0, 1).map((edu: any, i: number) => (
//               <View key={i} style={styles.miniRow}>
//                 <View style={styles.miniDot} />
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.miniTitle} numberOfLines={1}>
//                     {edu.degree || "—"}
//                   </Text>
//                   <Text style={styles.miniSub} numberOfLines={1}>
//                     {edu.institution || ""}
//                   </Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* Projects */}
//         {projects.length > 0 && (
//           <View style={styles.miniSection}>
//             <Text style={styles.miniLabel}>PROJECTS</Text>
//             {projects.slice(0, 2).map((proj: any, i: number) => (
//               <View key={i} style={styles.miniRow}>
//                 <View style={styles.miniDot} />
//                 <Text style={styles.miniTitle} numberOfLines={1}>
//                   {proj.title || "—"}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* Skills */}
//         {skills.length > 0 && (
//           <View style={styles.miniSection}>
//             <Text style={styles.miniLabel}>SKILLS</Text>
//             <View style={styles.skillRow}>
//               {skills.map((s, i) => (
//                 <View key={i} style={styles.skillPill}>
//                   <Text style={styles.skillPillText} numberOfLines={1}>
//                     {s}
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         )}

//         {/* Links */}
//         {d?.otherLinks && Object.values(d.otherLinks).some(Boolean) && (
//           <View style={styles.linksRow}>
//             {d.otherLinks.github && (
//               <Ionicons name="logo-github" size={12} color="#888" />
//             )}
//             {d.otherLinks.linkedIn && (
//               <Ionicons name="logo-linkedin" size={12} color="#0077B5" />
//             )}
//             {d.otherLinks.leetcode && (
//               <Ionicons name="code-slash-outline" size={12} color="#FFA116" />
//             )}
//           </View>
//         )}
//       </View>

//       {/* ── Card Footer ── */}
//       <View style={styles.cardFooter}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.cvName} numberOfLines={1}>
//             {resume.name}
//           </Text>
//           <Text style={styles.cvTime}>{resume.time}</Text>
//         </View>
//         <TouchableOpacity style={styles.moreBtn} onPress={onMorePress}>
//           <Ionicons name="ellipsis-vertical" size={18} color="#888" />
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     width: CARD_WIDTH,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     overflow: "hidden",
//     borderWidth: 2,
//     borderColor: "transparent",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   cardSelected: { borderColor: "#3BBFAD" },

//   // Mini Resume
//   resumeBody: {
//     padding: 14,
//     minHeight: 340,
//     backgroundColor: "#fff",
//   },
//   headerStrip: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 10,
//     marginBottom: 10,
//   },
//   avatarCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#3BBFAD",
//     justifyContent: "center",
//     alignItems: "center",
//     flexShrink: 0,
//   },
//   avatarText: {
//     fontSize: 13,
//     color: "#fff",
//     fontFamily: "WorkSansBold",
//   },
//   resumeName: {
//     fontSize: 13,
//     fontFamily: "WorkSansBold",
//     color: "#3D405B",
//     lineHeight: 18,
//   },
//   resumeBranch: {
//     fontSize: 10,
//     fontFamily: "WorkSansRegular",
//     color: "#3BBFAD",
//     lineHeight: 15,
//   },
//   resumeContact: {
//     fontSize: 9,
//     fontFamily: "WorkSansRegular",
//     color: "#888",
//     lineHeight: 14,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#3BBFAD",
//     marginBottom: 8,
//     opacity: 0.4,
//   },

//   // Sections
//   miniSection: { marginBottom: 8 },
//   miniLabel: {
//     fontSize: 7,
//     fontFamily: "WorkSansBold",
//     color: "#3BBFAD",
//     letterSpacing: 0.8,
//     marginBottom: 4,
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#e8e4d0",
//     paddingBottom: 2,
//   },
//   miniBody: {
//     fontSize: 8,
//     fontFamily: "WorkSansRegular",
//     color: "#555",
//     lineHeight: 12,
//   },
//   miniRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 5,
//     marginBottom: 3,
//   },
//   miniDot: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: "#3BBFAD",
//     marginTop: 4,
//     flexShrink: 0,
//   },
//   miniTitle: {
//     fontSize: 9,
//     fontFamily: "WorkSansSemiBold",
//     color: "#3D405B",
//     flex: 1,
//   },
//   miniSub: {
//     fontSize: 8,
//     fontFamily: "WorkSansRegular",
//     color: "#888",
//   },

//   // Skills
//   skillRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 4,
//   },
//   skillPill: {
//     backgroundColor: "#F4F1DE",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 10,
//   },
//   skillPillText: {
//     fontSize: 7,
//     fontFamily: "WorkSansRegular",
//     color: "#3D405B",
//     maxWidth: 70,
//   },

//   // Links row
//   linksRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 4,
//     paddingTop: 6,
//     borderTopWidth: 0.5,
//     borderTopColor: "#eee",
//   },

//   // Footer
//   cardFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 14,
//     borderTopWidth: 1,
//     borderTopColor: "#f0f0f0",
//     backgroundColor: "#fafafa",
//   },
//   cvName: {
//     fontSize: 13,
//     fontFamily: "WorkSansSemiBold",
//     color: "#3D405B",
//   },
//   cvTime: {
//     fontSize: 11,
//     color: "#888",
//     fontFamily: "WorkSansRegular",
//     marginTop: 2,
//   },
//   moreBtn: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#f5f5f5",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// components/ResumePreviewCard.tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { Resume } from "../../types/resume";
import { template as template1 } from "@/components/TemplateDesign/template1";
import { template as template2 } from "@/components/TemplateDesign/template2";
import { resolvePdfLayoutFromTemplateId } from "@/config/templateConfig";
import { fillTemplate } from "../appcomp/FillTemplate";
import { fillTemplate2 } from "../appcomp/FillTemplate2";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.68;
const PREVIEW_HEIGHT = 340;

// A4 page is 794px wide at 96dpi — we scale it down to fit the card
const A4_WIDTH = 794;
const SCALE = CARD_WIDTH / A4_WIDTH;
const SCALED_HEIGHT = PREVIEW_HEIGHT / SCALE;

interface Props {
  resume: Resume;
  isSelected: boolean;
  onPress: () => void;
  onMorePress: () => void;
}

export default function ResumePreviewCard({
  resume,
  isSelected,
  onPress,
  onMorePress,
}: Props) {
  // Build the exact same HTML used for PDF generation
  const html = useMemo(() => {
    try {
      const data = resume.data;
      const pdfLayout = resolvePdfLayoutFromTemplateId(data?.selected_template);
      return pdfLayout === "modern"
        ? fillTemplate2(template2, data)
        : fillTemplate(template1, data);
    } catch {
      return "<html><body><p>Preview unavailable</p></body></html>";
    }
  }, [resume.data]);

  // Inject CSS that removes page margins and disables scroll for the preview
  const previewHtml = html.replace(
    "<style>",
    `<style>
      html, body {
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
        width: ${A4_WIDTH}px !important;
      }
      body {
        margin: 40px 60px !important;
      }
    `
  );

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* ── Resume Preview ── */}
      <View style={styles.previewContainer}>
        {/* WebView renders at A4 width then we CSS-scale it down */}
        <View style={styles.scaleWrapper}>
          <WebView
            style={styles.webview}
            originWhitelist={["*"]}
            source={{ html: previewHtml }}
            scrollEnabled={false}
            pointerEvents="none"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            // Prevent any touch from passing through to WebView
            // so the card's onPress fires correctly
            onTouchStart={(e) => e.stopPropagation()}
          />
        </View>

        {/* Invisible tap layer over WebView so onPress works */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onPress}
          activeOpacity={1}
        />

        {/* Action buttons overlay */}
        <View style={styles.imageOverlay}>
          <TouchableOpacity style={styles.overlayBtn}>
            <Ionicons name="download-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.overlayBtn}>
            <Ionicons name="eye-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Card Footer ── */}
      <View style={styles.cardFooter}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cvName} numberOfLines={1}>
            {resume.name}
          </Text>
          <Text style={styles.cvTime}>{resume.time}</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn} onPress={onMorePress}>
          <Ionicons name="ellipsis-vertical" size={18} color="#888" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardSelected: {
    borderColor: "#3BBFAD",
  },

  // Preview area
  previewContainer: {
    width: CARD_WIDTH,
    height: PREVIEW_HEIGHT,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  scaleWrapper: {
    width: A4_WIDTH,
    height: SCALED_HEIGHT,
    transform: [
      { translateX: -(A4_WIDTH * (1 - SCALE)) / 2 },
      { translateY: -(SCALED_HEIGHT * (1 - SCALE)) / 2 },
      { scale: SCALE },
    ],
    position: "absolute",
    top: 0,
    left: 0,
  },
  webview: {
    width: A4_WIDTH,
    height: SCALED_HEIGHT,
    backgroundColor: "transparent",
  },

  // Overlay buttons
  imageOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    gap: 8,
  },
  overlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(61,64,91,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Footer
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fafafa",
  },
  cvName: {
    fontSize: 13,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  cvTime: {
    fontSize: 11,
    color: "#888",
    fontFamily: "WorkSansRegular",
    marginTop: 2,
  },
  moreBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
});
// ```

// ---

// ## How the scaling works
// ```
// A4 page = 794px wide
// Card = 68% of screen width (e.g. ~272px on a 400px screen)

// SCALE = 272 / 794 ≈ 0.34

// WebView renders at full 794px width (real resume size)
// then CSS transform: scale(0.34) shrinks it visually
// SCALED_HEIGHT = 340 / 0.34 ≈ 1000px (WebView tall enough to show content)