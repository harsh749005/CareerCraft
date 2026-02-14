import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface IndustrySelectorProps {
  nextStep: () => void;
  updateSelectedIndustry: (industry: string) => void;
}

export interface IndustryCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  templateCount: number;
}

const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  nextStep,
  updateSelectedIndustry,
}) => {
  const industries: IndustryCategory[] = [
    {
      id: "it",
      name: "Information Technology",
      description: "Software, DevOps, Data Science, Cybersecurity",
      icon: "💻",
      color: "#007AFF",
      templateCount: 3,
    },
    {
      id: "finance",
      name: "Finance & Accounting",
      description: "Banking, Investment, Audit, Financial Analysis",
      icon: "💰",
      color: "#34C759",
      templateCount: 3,
    },
    {
      id: "marketing",
      name: "Marketing & Sales",
      description: "Digital Marketing, Brand Management, Sales",
      icon: "📊",
      color: "#FF9500",
      templateCount: 3,
    },
    {
      id: "healthcare",
      name: "Healthcare & Medical",
      description: "Nursing, Medical Practice, Healthcare Admin",
      icon: "🏥",
      color: "#FF3B30",
      templateCount: 3,
    },
    {
      id: "education",
      name: "Education & Training",
      description: "Teaching, Curriculum Design, Academic Research",
      icon: "📚",
      color: "#5856D6",
      templateCount: 3,
    },
    {
      id: "government",
      name: "Government & Public Service",
      description: "Civil Service, Policy, Public Administration",
      icon: "🏛️",
      color: "#8E8E93",
      templateCount: 3,
    },
    {
      id: "creative",
      name: "Creative & Design",
      description: "Graphic Design, UX/UI, Content Creation",
      icon: "🎨",
      color: "#FF2D55",
      templateCount: 3,
    },
    {
      id: "engineering",
      name: "Engineering",
      description: "Mechanical, Civil, Electrical, Industrial",
      icon: "⚙️",
      color: "#5AC8FA",
      templateCount: 3,
    },
  ];

  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    updateSelectedIndustry(industryId);
  };

  const handleNext = async () => {
    if (selectedIndustry === null) {
      Alert.alert(
        "Select Industry",
        "Please choose your industry to see relevant templates",
        [{ text: "OK" }]
      );
      return;
    }

    setIsLoading(true);
    try {
      await nextStep();
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Industry</Text>
          <Text style={styles.subtitle}>
            Select your field to get tailored resume templates
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.industriesGrid}>
            {industries.map((industry) => (
              <TouchableOpacity
                key={industry.id}
                style={[
                  styles.industryCard,
                  selectedIndustry === industry.id && {
                    ...styles.selectedCard,
                    borderColor: industry.color,
                  },
                ]}
                onPress={() => handleIndustrySelect(industry.id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.industryIcon}>{industry.icon}</Text>
                  {selectedIndustry === industry.id && (
                    <View
                      style={[
                        styles.selectedBadge,
                        { backgroundColor: industry.color },
                      ]}
                    >
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.industryName}>{industry.name}</Text>
                <Text style={styles.industryDescription}>
                  {industry.description}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.templateCount}>
                    {industry.templateCount} templates
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  selectedIndustry !== null ? "#000000" : "#cccccc",
              },
            ]}
            onPress={handleNext}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.buttonText,
                { color: selectedIndustry !== null ? "white" : "#666666" },
              ]}
            >
              {isLoading ? "Loading..." : "Continue to Templates"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default IndustrySelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
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
    lineHeight: 24,
    paddingHorizontal: 20,
    color: "#a9a9a9ff",
    textAlign: "center",
    fontFamily: "WorkSansRegular",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  industriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  industryCard: {
    // width: "48%",
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    minHeight: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 3,
    backgroundColor: "#f0f8ff",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  industryIcon: {
    fontSize: 36,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedBadgeText: {
    color: "white",
    fontSize: 14,
    fontFamily: "WorkSansMedium",
  },
  industryName: {
    fontSize: 16,
    fontFamily: "WorkSansMedium",
    color: "#333333",
    marginBottom: 8,
    lineHeight: 22,
  },
  industryDescription: {
    fontSize: 12,
    fontFamily: "WorkSansRegular",
    color: "#666666",
    lineHeight: 18,
    flex: 1,
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  templateCount: {
    fontSize: 12,
    fontFamily: "WorkSansMedium",
    color: "#999999",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 15,
    minWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "WorkSansMedium",
  },
});