// components/screens/TemplateSelector/BranchSelectScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  BRANCH_OPTIONS,
  QUICK_ACCESS_BRANCHES,
  getBranchOption,
  BranchOption,
} from "../../../utils/branchUtils";
import { router } from "expo-router";

interface BranchSelectScreenProps {
  onNext: (branch: string) => void;  // passes BranchOption.value e.g. "CSE", "IT"
  nextStep: () => void;
  prevStep:() => void;
}

const BranchSelectScreen: React.FC<BranchSelectScreenProps> = ({ onNext, nextStep,prevStep }) => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBranches = BRANCH_OPTIONS.filter((b) =>
    b.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = selectedBranch ? getBranchOption(selectedBranch) : null;

  const handleSelect = (branch: BranchOption) => {
    setSelectedBranch(branch.value);  // ✅ stores "CSE", "IT", "ECE" etc.
    setModalVisible(false);
    setSearchQuery("");
  };

  const handleContinue = () => {
    if (!selectedBranch) return;
    onNext(selectedBranch);   // ✅ sends value up to BuildResume → setBranch()
    nextStep();               // ✅ advances step
  };

  // Group for modal list header rendering
  const techBranches = filteredBranches.filter((b) => b.category === "tech");
  const nonTechBranches = filteredBranches.filter((b) => b.category === "non-tech");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />
      {/* ── Navbar ── */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.leftIcon}>
          <Ionicons name="arrow-back" size={22} color="#3D405B" />
        </TouchableOpacity>
        <View style={styles.centerContent}>
          {/* <Text style={styles.stepText}>Step {step} of {totalSteps}</Text> */}
          <Text style={styles.navTitle}>EDUCATION</Text>
        </View>
        <TouchableOpacity style={styles.rightBtn}>
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      </View>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>{`What's your field of study?`}</Text>
        <Text style={styles.subtitle}>
         {` We'll recommend the best resume templates for your branch`}
        </Text>
      </View>

      {/* ── Quick Access Chips ── */}
      <Text style={styles.sectionLabel}>Popular choices</Text>
      <View style={styles.chipsRow}>
        {QUICK_ACCESS_BRANCHES.map((branch) => {
          const isActive = selectedBranch === branch.value;
          return (
            <TouchableOpacity
              key={branch.value}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setSelectedBranch(branch.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.chipIcon}>{branch.icon}</Text>
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {branch.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Browse All Button ── */}
      <TouchableOpacity
        style={styles.browseBtn}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="search" size={16} color="#3D405B" />
        <Text style={styles.browseBtnText}>
          {selectedOption && !QUICK_ACCESS_BRANCHES.find(b => b.value === selectedBranch)
            ? `${selectedOption.icon}  ${selectedOption.label}`
            : "Browse all branches..."}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#3D405B" />
      </TouchableOpacity>

      {/* ── Selected Info ── */}
      {selectedOption && (
        <View style={styles.selectedStrip}>
          <Text style={styles.selectedIcon}>{selectedOption.icon}</Text>
          <View>
            <Text style={styles.selectedLabel}>{selectedOption.label}</Text>
            <Text style={styles.selectedMeta}>
              {selectedOption.category === "tech" ? "Tech Branch" : "Non-Tech Branch"}
              {"  ·  "}
              <Text style={styles.selectedValue}>{selectedOption.value}</Text>
            </Text>
          </View>
          <Ionicons
            name="checkmark-circle"
            size={20}
            color="#3BBFAD"
            style={{ marginLeft: "auto" }}
          />
        </View>
      )}

      {/* ── Continue Button ── */}
      <TouchableOpacity
        style={[styles.continueBtn, !selectedBranch && styles.continueBtnDisabled]}
        onPress={handleContinue}
        disabled={!selectedBranch}
        activeOpacity={0.88}
      >
        <Text style={styles.continueBtnText}>
          {selectedBranch ? "CONTINUE" : "Select your branch"}
        </Text>
        {selectedBranch && (
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        )}
      </TouchableOpacity>

      {/* ── Full Branch Modal ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Your Branch</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#3D405B" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search branches..."
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={16} color="#aaa" />
              </TouchableOpacity>
            )}
          </View>

          {/* Branch List */}
          <FlatList
            data={filteredBranches}
            keyExtractor={(item) => item.value}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListHeaderComponent={
              techBranches.length > 0 && nonTechBranches.length > 0 ? null : undefined
            }
            renderItem={({ item, index }) => {
              // Category divider
              const showTechHeader =
                index === 0 && item.category === "tech" && searchQuery === "";
              const showNonTechHeader =
                item.category === "non-tech" &&
                searchQuery === "" &&
                (index === 0 || filteredBranches[index - 1].category === "tech");

              const isSelected = selectedBranch === item.value;

              return (
                <>
                  {showTechHeader && (
                    <Text style={styles.categoryHeader}>💡 Tech Branches</Text>
                  )}
                  {showNonTechHeader && (
                    <Text style={styles.categoryHeader}>🎓 Non-Tech Branches</Text>
                  )}
                  <TouchableOpacity
                    style={[styles.listItem, isSelected && styles.listItemSelected]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.listItemIcon}>{item.icon}</Text>
                    <View style={styles.listItemText}>
                      <Text style={[styles.listItemLabel, isSelected && styles.listItemLabelSelected]}>
                        {item.label}
                      </Text>
                      <Text style={styles.listItemValue}>{item.value}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#3BBFAD" />
                    )}
                  </TouchableOpacity>
                </>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1DE",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 36 : 52,
  },

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
  // Header
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    color: "#3D405B",
    fontFamily: "PlayfairDisplayBold",
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    fontFamily: "WorkSansRegular",
    lineHeight: 20,
  },

  // Quick access
  sectionLabel: {
    fontSize: 12,
    fontFamily: "WorkSansSemiBold",
    color: "#888",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
  },
  chipActive: {
    backgroundColor: "#3BBFAD",
    borderColor: "#3BBFAD",
  },
  chipIcon: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 13,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  chipTextActive: {
    color: "#fff",
  },

  // Browse button
  browseBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    marginBottom: 16,
  },
  browseBtnText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "WorkSansRegular",
    color: "#3D405B",
  },

  // Selected strip
  selectedStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#e8f5f2",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#c8e8e0",
    marginBottom: 24,
  },
  selectedIcon: {
    fontSize: 24,
  },
  selectedLabel: {
    fontSize: 14,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  selectedMeta: {
    fontSize: 12,
    fontFamily: "WorkSansRegular",
    color: "#888",
    marginTop: 2,
  },
  selectedValue: {
    fontFamily: "WorkSansSemiBold",
    color: "#3BBFAD",
  },

  // Continue button
  continueBtn: {
    flexDirection: "row",
    backgroundColor: "#3BBFAD",
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 24,
  },
  continueBtnDisabled: {
    backgroundColor: "#ccc",
  },
  continueBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1.5,
    fontFamily: "WorkSansBold",
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "#F4F1DE",
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "WorkSansRegular",
    color: "#3D405B",
  },
  categoryHeader: {
    fontSize: 12,
    fontFamily: "WorkSansSemiBold",
    color: "#888",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F4F1DE",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  listItemSelected: {
    borderColor: "#3BBFAD",
    backgroundColor: "#f0faf8",
  },
  listItemIcon: {
    fontSize: 22,
  },
  listItemText: {
    flex: 1,
  },
  listItemLabel: {
    fontSize: 14,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  listItemLabelSelected: {
    color: "#3BBFAD",
  },
  listItemValue: {
    fontSize: 11,
    fontFamily: "WorkSansRegular",
    color: "#aaa",
    marginTop: 2,
  },
});

export default BranchSelectScreen;