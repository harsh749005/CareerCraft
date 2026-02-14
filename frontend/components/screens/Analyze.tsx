import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
// import { api } from "../api/api"; // adjust path if needed

const Analyze = () => {
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState(null);

  const handleAnalyze = async () => {
    try {
      // 1️⃣ Pick file
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.canceled) return;

      const file = result.assets[0];

      // 2️⃣ Prepare FormData
      const formData = new FormData();
      // formData.append("file", {
      //   uri: file.uri,
      //   name: file.name,
      //   type: file.mimeType || "application/pdf",
      // });

      setLoading(true);

      // 3️⃣ Send to backend
      // const response = await api.post("/upload", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      // 4️⃣ Save file_id for chat
      // setFileId(response.data.file_id);

      // Alert.alert("Success", "Report uploaded and analyzed!");

      // console.log("File ID:", response.data.file_id);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to analyze report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analyze Report</Text>
      </View>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.buildButton}
          onPress={handleAnalyze}
          disabled={loading}
        >
          <Text style={styles.buildButtonText}>
            {loading ? "Analyzing..." : "Analyze"}
          </Text>
        </TouchableOpacity>

        {fileId && (
          <Text style={{ marginTop: 10, color: "green" }}>
            File ready for questions ✅
          </Text>
        )}
      </View>
    </View>
  );
};

export default Analyze;


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
  title: {
    fontFamily: "PlayfairDisplayRegular",
    fontSize: 28,
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },  buildButton: {
    backgroundColor: "#000000",
    width: "100%",
    maxWidth: 300,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  //   borderRadius: 8,
  },
  buildButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "WorkSansMedium",
  },
});
