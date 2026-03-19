import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const resumeTemplates: any[] = [];

export default function Dashboard() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.heading}>My Resumes</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn}>
          <Ionicons name="person-outline" size={20} color="#3D405B" />
        </TouchableOpacity>
      </View>

      {/* ── Stats row ── */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{resumeTemplates.length}</Text>
          <Text style={styles.statLabel}>Resumes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#e8f5f2" }]}>
          <Text style={[styles.statNumber, { color: "#3BBFAD" }]}>0</Text>
          <Text style={styles.statLabel}>Downloads</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>—</Text>
          <Text style={styles.statLabel}>Last Edit</Text>
        </View>
      </View>

      {/* ── Section label ── */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Your Documents</Text>
        {resumeTemplates.length > 0 && (
          <TouchableOpacity>
            <Text style={styles.sectionAction}>See all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Content ── */}
      <View style={styles.contentArea}>
        {resumeTemplates.length === 0 ? (
          /* ── Empty State ── */
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyIllustration}>
              <View style={styles.emptyDocBig}>
                <View style={styles.emptyLine} />
                <View style={[styles.emptyLine, { width: "60%" }]} />
                <View style={[styles.emptyLine, { width: "80%" }]} />
                <View style={[styles.emptyLine, { width: "50%" }]} />
              </View>
              <View style={styles.emptyDocSmall}>
                <View style={styles.emptyLine} />
                <View style={[styles.emptyLine, { width: "70%" }]} />
              </View>
              <View style={styles.emptyPlusBadge}>
                <Ionicons name="add" size={20} color="#fff" />
              </View>
            </View>

            <Text style={styles.emptyTitle}>No resumes yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first professional resume{"\n"}in just a few minutes
            </Text>

            <TouchableOpacity
              style={styles.emptyCreateBtn}
              onPress={() => router.push("/BuildResume")}
              activeOpacity={0.85}
            >
              <Ionicons
                name="add"
                size={18}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.emptyCreateText}>Create New Resume</Text>
            </TouchableOpacity>

            {/* Tips */}
            <View style={styles.tipsRow}>
              {["ATS Friendly", "PDF Export", "AI Powered"].map((tip, i) => (
                <View key={i} style={styles.tipChip}>
                  <Ionicons
                    name={
                      i === 0
                        ? "checkmark-circle-outline"
                        : i === 1
                          ? "document-outline"
                          : "flash-outline"
                    }
                    size={13}
                    color="#3BBFAD"
                  />
                  <Text style={styles.tipChipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          /* ── Resume Cards ── */
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={width * 0.72 + 20}
            snapToAlignment="start"
            contentContainerStyle={styles.scrollContainer}
          >
            {resumeTemplates.map((template, index) => {
              const isSelected = selectedTemplate === index;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.resumeCard,
                    isSelected && styles.resumeCardSelected,
                  ]}
                  onPress={() => setSelectedTemplate(index)}
                  activeOpacity={0.9}
                >
                  {/* Image */}
                  <View style={styles.imageWrapper}>
                    <Image
                      source={template.image}
                      style={styles.resumeImage}
                      resizeMode="cover"
                    />

                    {/* Action buttons overlay */}
                    <View style={styles.imageOverlay}>
                      <TouchableOpacity style={styles.overlayBtn}>
                        <Ionicons
                          name="download-outline"
                          size={18}
                          color="#fff"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.overlayBtn}>
                        <Ionicons name="eye-outline" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Card Footer */}
                  <View style={styles.cardFooter}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cvName} numberOfLines={1}>
                        {template.name}
                      </Text>
                      <Text style={styles.cvTime}>{template.time}</Text>
                    </View>
                    <TouchableOpacity style={styles.moreBtn}>
                      <Ionicons
                        name="ellipsis-vertical"
                        size={18}
                        color="#888"
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* ── Create Button ── */}
      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => router.push("/BuildResume")}
        activeOpacity={0.88}
      >
        <View style={styles.createBtnIcon}>
          <Ionicons name="add" size={20} color="#3BBFAD" />
        </View>
        <Text style={styles.createBtnText}>Create a new resume</Text>
        <Ionicons
          name="arrow-forward"
          size={18}
          color="#fff"
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1DE",
    paddingTop: 56,
    paddingHorizontal: 20,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    color: "#888",
    fontFamily: "WorkSansRegular",
    marginBottom: 2,
  },
  heading: {
    fontSize: 28,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
    lineHeight: 34,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e8e4d0",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e8e4d0",
  },
  statNumber: {
    fontSize: 22,
    fontFamily: "WorkSansBold",
    color: "#3D405B",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#888",
    fontFamily: "WorkSansRegular",
  },

  // Section
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  sectionAction: {
    fontSize: 13,
    color: "#3BBFAD",
    fontFamily: "WorkSansSemiBold",
  },

  contentArea: { flex: 1 },

  // ── Empty State ──
  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  emptyIllustration: {
    position: "relative",
    width: 140,
    height: 140,
    marginBottom: 28,
  },
  emptyDocBig: {
    position: "absolute",
    left: 10,
    top: 10,
    width: 90,
    height: 110,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e8e4d0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  emptyDocSmall: {
    position: "absolute",
    right: 0,
    bottom: 10,
    width: 65,
    height: 75,
    backgroundColor: "#e8f5f2",
    borderRadius: 8,
    padding: 10,
    gap: 7,
    borderWidth: 1,
    borderColor: "#c8e8e0",
  },
  emptyLine: {
    height: 7,
    width: "100%",
    backgroundColor: "#f0ede0",
    borderRadius: 4,
  },
  emptyPlusBadge: {
    position: "absolute",
    right: 6,
    top: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3BBFAD",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3BBFAD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    fontFamily: "WorkSansRegular",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  emptyCreateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3BBFAD",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 32,
    marginBottom: 20,
  },
  emptyCreateText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "WorkSansBold",
  },
  tipsRow: {
    flexDirection: "row",
    gap: 8,
  },
  tipChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e8e4d0",
  },
  tipChipText: {
    fontSize: 11,
    color: "#3D405B",
    fontFamily: "WorkSansSemiBold",
  },

  // ── Resume Cards ──
  scrollContainer: {
    paddingBottom: 10,
    paddingRight: 20,
    gap: 20,
  },
  resumeCard: {
    width: width * 0.68,
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
  resumeCardSelected: {
    borderColor: "#3BBFAD",
  },
  imageWrapper: {
    position: "relative",
  },
  resumeImage: {
    width: "100%",
    height: 340,
  },
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
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cvName: {
    fontSize: 15,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  cvTime: {
    fontSize: 12,
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

  // Create Button
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3BBFAD",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 32,
    marginBottom: 24,
    gap: 12,
  },
  createBtnIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  createBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "WorkSansBold",
  },
});
