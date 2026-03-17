import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const { width } = Dimensions.get("window");

const templates = [
  require("../../assets/images/resume/resume1.png"),
  require("../../assets/images/resume/resume2.jpg"),
  require("../../assets/images/resume/resume2.jpg"),
  require("../../assets/images/resume/resume3.jpg"),
];

export default function ResumeOptions({
  nextStep,
  prevStep,
  updateSelectedTemplate,
  step,
  totalSteps,
}: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const handleScroll = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (width * 0.75 + 16),
    );
    setCurrentIndex(index);
  };
  // const handleSelect = (templateId: string) => {
  //   updateSelectedTemplate(templateId); // 🔥 send data to parent
  //   nextStep(); // 🔥 go to next step
  //   console.log("templateId", templateId);
  // };
  const handleSelect = (index: number) => {
    setSelectedIndex(index); // local UI highlight
    updateSelectedTemplate(`template_${index + 1}`); // send to parent
  };
  // useEffect to verify the templateId is selected

  return (
    <View style={styles.container}>
      {/* 🔹 Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => prevStep()}>
          <Ionicons name="arrow-back" size={22} color="#3D405B" />
        </TouchableOpacity>

        <Text style={styles.stepText}>
          Step {step} of {totalSteps}
        </Text>

        {/* Spacer for symmetry */}
        <View style={{ width: 22 }} />
      </View>
      {/* 🔹 Section Heading */}
      <Text style={styles.sectionHeading}>CHOOSE TEMPLATE</Text>

      {/* 🔹 Main Title */}
      <Text style={styles.mainHeading}>
        Find the perfect template for your Resume
      </Text>

      {/* 🔹 Slider */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContainer}
      >
        {templates.map((template, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelect(index)}
            activeOpacity={0.8}
            style={[
              styles.templateContainer,
              selectedIndex === index && styles.selectedTemplate,
            ]}
          >
            <Image source={template} style={styles.image} />

            {/* ✅ Tick Box */}
            {selectedIndex === index && (
              <View style={styles.tickBox}>
                <Ionicons name="checkmark" size={14} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 🔹 Template Counter */}
      <Text style={styles.counter}>
        Template {currentIndex + 1} / {templates.length}
      </Text>

      {/* 🔹 Bottom Button */}
      <TouchableOpacity style={styles.selectBtn} onPress={() => nextStep()}>
        <Text style={styles.selectBtnText}>Select the template</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1DE",
    // paddingTop: 60,
    paddingHorizontal: 16,
  },

  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  stepText: {
    fontSize: 16,
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },

  sectionHeading: {
    marginTop: 20,
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: "WorkSansMedium",
    color: "#6c6c6c",
    textAlign: "center",
  },

  mainHeading: {
    marginTop: 10,
    fontSize: 26,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
    textAlign: "center",
  },

  scrollContainer: {
    paddingVertical: 40,
    paddingHorizontal: 15,
  },

  templateContainer: {
    width: width * 0.75,
    height: 380,
    marginRight: 16,
    // borderRadius: 16,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 380,
    // borderRadius: 16,
  },

  counter: {
    textAlign: "center",
    fontSize: 14,
    color: "#6c6c6c",
    marginBottom: 65,
  },

  selectBtn: {
    backgroundColor: "#81B29A",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },

  selectBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "WorkSansBold",
  },
  selectedTemplate: {
    borderWidth: 2,
    borderColor: "#81B29A",
    transform: [{ scale: 1.02 }],
  },
  tickBox: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#81B29A",
    padding: 6,
    borderRadius: 6, // rectangular feel
  },
});
