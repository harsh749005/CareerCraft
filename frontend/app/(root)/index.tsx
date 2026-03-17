import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";

const { width } = Dimensions.get("window");


// 👉 Try empty array to test empty state
const resumeTemplates: any[] = [];

// 
export default function Dashboard() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const handleTemplateSelect = (index: number) => {
    setSelectedTemplate(index);
  };

  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>Dashboard</Text>

      {/* Subtitle */}
      <Text style={styles.subHeading}>
        All your CVs are displayed here
      </Text>

      {/* Scroll Slider */}
            {/* ✅ CONDITIONAL RENDER */}
      {resumeTemplates.length === 0 ? (
        // 🔹 Empty State
        <TouchableOpacity style={styles.emptyContainer} activeOpacity={0.8} onPress={() => router.push("/BuildResume")} >
          <Ionicons name="document-text-outline" size={50} color="#81B29A" />
          <Text style={styles.emptyText}>Create a New Document</Text>
        </TouchableOpacity>
      ) : 
      (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces
        alwaysBounceHorizontal
        overScrollMode="always"
        contentContainerStyle={styles.scrollContainer}
      >
        {resumeTemplates.map((template, index) => (
          <View key={index} style={styles.templateContainer}>
            
            {/* Image Container */}
            <TouchableOpacity
              style={[
                styles.resumeImageContainer,
              ]}
              onPress={() => handleTemplateSelect(index)}
              activeOpacity={0.8}
            >
              <Image
                source={template.image}
                style={styles.resumeImage}
                resizeMode="cover"
              />

              {/* Download Button */}
              <TouchableOpacity style={styles.downloadBtn}>
                <Ionicons name="download-outline" size={20} color="#fff" />
              </TouchableOpacity>


            </TouchableOpacity>

            {/* Info Row */}
            <View style={styles.infoRow}>
              <View>
                <Text style={styles.cvName}>{template.name}</Text>
                <Text style={styles.time}>{template.time}</Text>
              </View>

              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      )}
      {/* Bottom Button */}
      <TouchableOpacity style={styles.createBtn}>
        <Text style={styles.createBtnText}>Create a new CV</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1DE",
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  heading: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },

  subHeading: {
    marginTop: 10,
    fontSize: 24,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
    textAlign: "center",
  },

  scrollContainer: {
    paddingVertical: 30,
    paddingHorizontal: 15,
  },

  templateContainer: {
    width: width * 0.75,
    marginRight: 16,
  },

  resumeImageContainer: {
    // borderRadius: 16,
    overflow: "hidden",
  },


  resumeImage: {
    width: 260,
    height: 380,
  },

  downloadBtn: {
    position: "absolute",
    bottom: 10,
    right: 20,
    backgroundColor: "#81b29a",
    padding: 10,
    borderRadius: 50,
  },

  infoRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cvName: {
    fontSize: 16,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },

  time: {
    fontSize: 12,
    color: "#6c6c6c",
  },

  createBtn: {
    marginTop: "auto",
    marginBottom: 20,
    backgroundColor: "#81B29A",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  createBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "WorkSansBold",
  },
  emptyContainer: {
  marginTop: 40,
  height: 200,
  borderWidth: 2,
  borderColor: "#81B29A",
  borderStyle: "dashed",
  borderRadius: 20,
  justifyContent: "center",
  alignItems: "center",
},

emptyText: {
  marginTop: 10,
  fontSize: 16,
  fontFamily: "WorkSansMedium",
  color: "#3D405B",
},
});