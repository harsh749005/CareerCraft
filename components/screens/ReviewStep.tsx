import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import CustomLoader from "../appcomp/CustomLoader";
import { generatePDF } from "../generator/GeneratePDF";
import { useUser } from "@clerk/clerk-expo";

interface ReviewStepProps {
  data: any;
  prevStep: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data, prevStep }) => {
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const handleSubmit = async () => {
    setIsGenerating(true);
    try {
      setTimeout(async () => {
        console.log("Final Form Data:", data);
        alert("Form Submitted Successfully!");
        const pdfPath = await generatePDF(data);
        alert(`PDF saved at: ${pdfPath}`);
        setIsGenerating(false);
      }, 3000);
      // Here you can also open/share the PDF if you want
    } catch (err) {
      setIsGenerating(false);
      console.error("Error generating PDF:", err);
      alert("Something went wrong while generating the PDF.");
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 4 of 4</Text>
          </View> */}
          <Text style={styles.title}>Review Your Resume</Text>
          <Text style={styles.subtitle}>
            Please review all information before generating your professional
            resume
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Personal Information Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{user?.username}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>
                {user?.emailAddresses[0].emailAddress}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Number:</Text>
              <Text style={styles.infoValue}>
                {data.personal_info.number}
              </Text>
            </View>
          </View>

          {/* Work Experience Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {data.work_experience.map((exp: any, i: number) => (
              <View key={i} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.role}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Company:</Text>
                  <Text style={styles.infoValue}>{exp.company}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Duration:</Text>
                  <Text style={styles.infoValue}>
                    {exp.start} - {exp.end}
                  </Text>
                </View>
                {exp.description && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>
                      {exp.description}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
          {/* Education Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.projects.map((proj: any, i: number) => (
              <View key={i} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.title}</Text>
                </View>
                <View style={styles.projectInfoRow}>
                  <Text style={styles.infoLabel}>Project description :</Text>
                  <Text style={styles.infoValue}>{proj.description}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Live link:</Text>
                  <Text style={styles.infoValue}>{proj.liveUrl}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Education Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu: any, i: number) => (
              <View key={i} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Field of Study:</Text>
                  <Text style={styles.infoValue}>{edu.degree}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Institution:</Text>
                  <Text style={styles.infoValue}>{edu.institution}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>CGPA:</Text>
                  <Text style={styles.infoValue}>{edu.result}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Skills Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {Object.entries(data.skills).map(([category, skills], i) => {
              const typedSkills = skills as string[];
              return (
                <View key={i} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>{category}</Text>
                  <View style={styles.skillsList}>
                    {typedSkills.map((skill, j) => (
                      <View key={j} style={styles.skillItem}>
                        <Text style={styles.skillBullet}>•</Text>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Certifications Section */}
          {/* <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((cert: string, i: number) => (
              <View key={i} style={styles.certificateItem}>
                <Text style={styles.certificateBullet}>•</Text>
                <Text style={styles.certificateText}>{cert}</Text>
              </View>
            ))}
          </View> */}

          {/* Languages Section */}
          {/* <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {data.languages.map((lang: string, i: number) => (
              <View key={i} style={styles.languageItem}>
                <Text style={styles.languageBullet}>•</Text>
                <Text style={styles.languageText}>{lang}</Text>
              </View>
            ))}
          </View> */}
          {/* Other Links Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Other Links</Text>
            {Object.entries(data.otherLinks).map(([key, value], index) => (
              <View key={index} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{key}</Text>
                <Text style={styles.infoValue}>{value}</Text>
              </View>
            ))}
          </View>

          {/* Professional Summary Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                {data.professional_summary}
              </Text>
            </View>
          </View>

          {/* Selected Template Section */}
          {/* <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Selected Template</Text>
            <View style={styles.templateContainer}>
              <Text style={styles.templateName}>{data.selected_template}</Text>
            </View>
          </View> */}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={prevStep}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
            {isGenerating ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <CustomLoader size={14} color="#ffffff" bars={8} />
                <Text style={styles.nextButtonText}>Generateing...</Text>
              </View>
            ) : (
              <Text style={styles.nextButtonText}>Generate Resume</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Review complete - Ready to generate
          </Text>
        </View>
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

  scrollView: {
    flex: 1,
  },

  sectionCard: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    color: "#333333",
    fontFamily: "WorkSansMedium",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  itemContainer: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  itemHeader: {
    marginBottom: 8,
  },

  itemTitle: {
    fontSize: 16,
    color: "#007AFF",
    fontFamily: "WorkSansMedium",
  },
  projectInfoRow: {
    flexDirection: "column",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
    flexWrap: "wrap",
  },

  infoLabel: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "WorkSansMedium",
    minWidth: 80,
    marginRight: 8,
  },

  infoValue: {
    fontSize: 14,
    color: "#333333",
    fontFamily: "WorkSansRegular",
    flex: 1,
  },

  descriptionContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  descriptionText: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "WorkSansRegular",
    lineHeight: 20,
  },

  skillCategory: {
    marginBottom: 16,
  },

  skillCategoryTitle: {
    fontSize: 16,
    color: "#007AFF",
    fontFamily: "WorkSansMedium",
    marginBottom: 8,
  },

  skillsList: {
    paddingLeft: 8,
  },

  skillItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },

  skillBullet: {
    fontSize: 16,
    color: "#007AFF",
    fontFamily: "WorkSansMedium",
    marginRight: 8,
    lineHeight: 20,
  },

  skillText: {
    fontSize: 14,
    color: "#333333",
    fontFamily: "WorkSansRegular",
    flex: 1,
    lineHeight: 20,
  },

  certificateItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  certificateBullet: {
    fontSize: 16,
    color: "#007AFF",
    fontFamily: "WorkSansMedium",
    marginRight: 8,
    lineHeight: 20,
  },

  certificateText: {
    fontSize: 14,
    color: "#333333",
    fontFamily: "WorkSansRegular",
    flex: 1,
    lineHeight: 20,
  },

  languageItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  languageBullet: {
    fontSize: 16,
    color: "#007AFF",
    fontFamily: "WorkSansMedium",
    marginRight: 8,
    lineHeight: 20,
  },

  languageText: {
    fontSize: 14,
    color: "#333333",
    fontFamily: "WorkSansRegular",
    flex: 1,
    lineHeight: 20,
  },

  summaryContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  summaryText: {
    fontSize: 14,
    color: "#333333",
    fontFamily: "WorkSansRegular",
    lineHeight: 22,
  },

  templateContainer: {
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
  },

  templateName: {
    fontSize: 16,
    color: "#007AFF",
    fontFamily: "WorkSansMedium",
    textAlign: "center",
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
    minWidth: 140,
  },

  nextButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "WorkSansMedium",
  },

  generatingButton: {
    backgroundColor: "#333333",
  },

  disabledButton: {
    backgroundColor: "#e0e0e0",
  },

  disabledButtonText: {
    color: "#999999",
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loader: {
    marginRight: 8,
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

export default ReviewStep;
