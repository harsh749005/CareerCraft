import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
interface SkillsStepProps {
  data: any;
  updateSkill: any;
  nextStep: () => void;
  prevStep: () => void;
}
const SkillsStep: React.FC<SkillsStepProps> = ({
  data,
  updateSkill,
  nextStep,
  prevStep,
}) => {
  const [activeTab, setActiveTab] = useState("languages");
  const [inputText, setInputText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get current skills based on active tab
  const getCurrentSkills = () => data.skills?.[activeTab] || [];

  const tabs = [
    {
      key: "languages",
      label: "Languages",
      icon: <Entypo name="code" size={16} color="black" />,
    },
    {
      key: "frameworks",
      label: "Frameworks",
      icon: <MaterialIcons name="web" size={16} color="black" />,
    },
    {
      key: "tools",
      label: "Tools",
      icon: <Entypo name="tools" size={16} color="black" />,
    },
    {
      key: "databases",
      label: "Databases",
      icon: <MaterialIcons name="storage" size={16} color="black" />,
    },
  ];

  // Categorized technologies
  const technologiesByCategory: any = {
    languages: [
      "JavaScript",
      "Python",
      "Java",
      "TypeScript",
      "PHP",
      "C++",
      "C#",
      "Ruby",
      "Go",
      "Swift",
      "Kotlin",
      "Rust",
      "Dart",
      "Scala",
    ],
    frameworks: [
      "React",
      "Vue.js",
      "Angular",
      "Node.js",
      "Express.js",
      "Next.js",
      "Django",
      "Flask",
      "Spring Boot",
      "Laravel",
      "React Native",
      "Flutter",
    ],
    tools: [
      "Git",
      "Docker",
      "Webpack",
      "Vite",
      "Jenkins",
      "GitHub Actions",
      "Postman",
      "VS Code",
      "IntelliJ",
      "Figma",
      "Photoshop",
    ],
    databases: [
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "SQLite",
      "Firebase",
      "Oracle",
      "Cassandra",
      "DynamoDB",
    ],
  };

  const allTechnologies = technologiesByCategory[activeTab] || [];
  const currentSkills = getCurrentSkills();
  const handleNext = () => {
    const totalSkills = Object.values(data.skills || {}).flat().length;
    if (totalSkills === 0) {
      Alert.alert(
        "Select Skills",
        "Please select at least one skill to continue",
        [{ text: "OK" }]
      );
      return;
    }
    nextStep();
  };

  const filteredSuggestions = allTechnologies.filter(
    (tech: string) =>
      tech.toLowerCase().includes(inputText.toLowerCase()) &&
      !currentSkills.includes(tech)
  );

  const handleInputChange = (text: string) => {
    setInputText(text);
    setShowSuggestions(text.length > 0);
  };

  const handleAddSkill = (skill: any) => {
    updateSkill(activeTab, skill);
    setInputText("");
    setShowSuggestions(false);
  };

  const handleManualAdd = () => {
    if (inputText.trim() && !currentSkills.includes(inputText.trim())) {
      handleAddSkill(inputText.trim());
    }
  };

  const getTabTitle = (tab: any) => {
    const count = data.skills?.[tab.key]?.length || 0;
    return `${tab.label}${count > 0 ? ` (${count})` : ""}`;
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Progress Indicator */}
          {/* <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 3 of 4</Text>
          </View> */}
          <Text style={styles.title}>Technical Skills</Text>
          <Text style={styles.subtitle}>
            Add your programming languages, frameworks, tools, and databases
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                onPress={() => {
                  setActiveTab(tab.key);
                  setInputText("");
                  setShowSuggestions(false);
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.activeTabText,
                    {},
                  ]}
                >
                  {tab.icon}
                </Text>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.activeTabText,
                    {},
                  ]}
                >
                  {getTabTitle(tab)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Add ${tabs
              .find((t) => t.key === activeTab)
              ?.label.toLowerCase()}...`}
            value={inputText}
            onChangeText={handleInputChange}
            onSubmitEditing={handleManualAdd}
          />
          {inputText.length > 0 && (
            <TouchableOpacity style={styles.addBtn} onPress={handleManualAdd}>
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggestions:</Text>
            <ScrollView style={styles.suggestionsScroll} nestedScrollEnabled>
              {filteredSuggestions
                .slice(0, 8)
                .map((tech: string, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleAddSkill(tech)}
                  >
                    <Text style={styles.suggestionText}>{tech}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}

        <ScrollView
          style={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Selected Skills for Current Tab */}
          <View style={styles.selectedSection}>
            <Text style={styles.sectionTitle}>
              Selected {tabs.find((t) => t.key === activeTab)?.label} (
              {currentSkills.length})
            </Text>
            <View style={styles.selectedContainer}>
              {currentSkills.map((skill: string, index: number) => (
                <View key={index} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{skill}</Text>
                  <TouchableOpacity
                    onPress={() => updateSkill(activeTab, skill)}
                    style={styles.removeBtn}
                  >
                    <Text style={styles.removeBtnText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {currentSkills.length === 0 && (
                <Text style={styles.emptyText}>
                  No{" "}
                  {tabs.find((t) => t.key === activeTab)?.label.toLowerCase()}{" "}
                  selected yet.
                </Text>
              )}
            </View>
          </View>

          {/* Popular for Current Category */}
          <View style={styles.popularSection}>
            <Text style={styles.sectionTitle}>
              Popular {tabs.find((t) => t.key === activeTab)?.label}
            </Text>
            <View style={styles.skillsContainer}>
              {allTechnologies
                .slice(0, 8)
                .map((skill: string, index: number) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.skillOption,
                      currentSkills.includes(skill) &&
                        styles.selectedSkillOption,
                    ]}
                    onPress={() => handleAddSkill(skill)}
                  >
                    <Text
                      style={[
                        styles.skillText,
                        currentSkills.includes(skill) &&
                          styles.selectedSkillText,
                      ]}
                    >
                      {skill} {currentSkills.includes(skill) && "✓"}
                    </Text>
                  </Pressable>
                ))}
            </View>
          </View>

          {/* All Selected Skills Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>All Selected Skills</Text>
            {Object.entries(data.skills || {}).map(([category, skills]) => {
              const typedSkills = skills as string[];
              return (
                typedSkills.length > 0 && (
                  <View key={category} style={styles.summaryCategory}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Text style={styles.summaryCategoryTitle}>
                        {tabs.find((t) => t.key === category)?.icon}
                      </Text>
                      <Text style={styles.summaryCategoryTitle}>
                        {tabs.find((t) => t.key === category)?.label} (
                        {typedSkills.length})
                      </Text>
                    </View>
                    <Text style={styles.summarySkills}>
                      {typedSkills.join(", ")}
                    </Text>
                  </View>
                )
              );
            })}
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={prevStep}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        {/* <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 3 of 4</Text>
        </View> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  stepIndicator: {
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    // borderRadius: 20,
    marginBottom: 16,
  },
  stepText: {
    fontSize: 12,
    fontFamily: "WorkSansMedium",
    color: "#007AFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: "PlayfairDisplayRegular",
    fontSize: 28,
    color: "#333333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#a9a9a9",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
    fontFamily: "WorkSansRegular",
  },
  tabContainer: {
    marginBottom: 15,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    // borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "WorkSansMedium",
    color: "#666",
  },
  activeTabText: {
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    // borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "WorkSansRegular",
  },
  addBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  addBtnText: {
    color: "white",
    fontFamily: "WorkSansMedium",
  },
  suggestionsContainer: {
    backgroundColor: "#f9f9f9",
    // borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    maxHeight: 120,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontFamily: "WorkSansMedium",
    color: "#666",
    marginBottom: 8,
  },
  suggestionsScroll: {
    maxHeight: 80,
  },
  suggestionItem: {
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  suggestionText: {
    fontSize: 15,
    fontFamily: "WorkSansRegular",
    color: "#007AFF",
  },
  contentScroll: {
    flex: 1,
  },
  selectedSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "WorkSansMedium",
    color: "#333",
    marginBottom: 10,
  },
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minHeight: 40,
  },
  selectedTag: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    // borderRadius: 20,
  },
  selectedTagText: {
    color: "white",
    fontSize: 14,
    fontFamily: "WorkSansRegular",
  },
  removeBtn: {
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtnText: {
    color: "white",
    fontSize: 16,
    fontFamily: "WorkSansMedium",
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
    fontFamily: "WorkSansRegular",
    alignSelf: "center",
    marginTop: 10,
  },
  popularSection: {
    marginBottom: 20,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillOption: {
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    // borderRadius: 20,
    alignSelf: "flex-start",
  },
  selectedSkillOption: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  skillText: {
    textAlign: "center",
    fontFamily: "WorkSansRegular",
    fontSize: 14,
    color: "#333",
  },
  selectedSkillText: {
    color: "white",
  },
  summarySection: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    // borderRadius: 10,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: "WorkSansMedium",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  summaryCategory: {
    marginBottom: 12,
  },
  summaryCategoryTitle: {
    fontSize: 16,
    fontFamily: "WorkSansMedium",
    color: "#555",
    marginBottom: 4,
  },
  summarySkills: {
    fontSize: 14,
    fontFamily: "WorkSansRegular",
    color: "#666",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 30,
    // borderRadius: 8,
    minWidth: 100,
  },
  backButtonText: {
    color: "#333",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "WorkSansMedium",
  },
  nextButton: {
    backgroundColor: "#000000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    minWidth: 100,
  },
  nextButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "WorkSansMedium",
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: "#999999",
    fontFamily: "WorkSansRegular",
  },
});

export default SkillsStep;
