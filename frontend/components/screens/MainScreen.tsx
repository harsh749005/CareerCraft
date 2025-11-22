import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";

const MainScreen = () => {
  const files = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>My Resumes</Text>
          <Text style={styles.subtitle}>Manage your professional profiles</Text>
        </View>

        {/* Scrollable Resume List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={
            files.length === 0 
              ? styles.emptyFilesContainer 
              : styles.filesContainer
          }
          showsVerticalScrollIndicator={true}
        >
          {
          files.length === 0 ? (
            <Text style={styles.noFilesText}>No resumes uploaded yet.</Text>
          ):(

          
          files.map((index) => (
         
                
            
            <TouchableOpacity key={index} style={styles.files}>
              <View style={styles.filedetails}>
                <View style={styles.iconPlaceholder}>
                  <Text style={styles.iconText}>📄</Text>
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>Resume {index}</Text>
                  <Text style={styles.fileDate}>Last edited: 2 days ago</Text>
                </View>
              </View>
              <View style={styles.fileoptions}>
                <Text style={styles.optionsText}>⋮</Text>
              </View>
            </TouchableOpacity>
          )
        ))}
        </ScrollView>

        {/* Build New Resume Button - Fixed at Bottom */}
        <TouchableOpacity
          style={styles.buildButton}
          onPress={() => Alert.alert("Build Resume", "Creating new resume...")}
        >
          <Text style={styles.buildButtonText}>+ Build New Resume</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#ffffff",
  },
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontFamily: "PlayfairDisplayRegular",
    fontSize: 28,
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,

  },
  subtitle: {
    fontSize: 12,
    fontFamily: "WorkSansMedium",
    color: "#666666",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  filesContainer: {
    gap: 12,
    paddingBottom: 10,
  },
  emptyFilesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  files: {
    height: 70,
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    // borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filedetails: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 15,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: "#e8f4f8",
    // borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontFamily: "WorkSansMedium",
    color: "#333333",
    marginBottom: 3,
  },
  fileDate: {
    fontSize: 12,
    fontFamily: "WorkSansRegular",
    color: "#999999",
  },
  fileoptions: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  optionsText: {
    fontSize: 24,
    color: "#666666",
    fontWeight: "bold",
  },
  noFilesText: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    fontFamily: "WorkSansMedium",
  },
  buildButton: {
    backgroundColor: "#000000",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 0,
    
  },
  buildButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "WorkSansMedium",
    // letterSpacing: 0.5,
  },
});