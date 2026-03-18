import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  title: string;
  data: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

const PickerModal: React.FC<Props> = ({
  visible,
  title,
  data,
  selectedValue,
  onSelect,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="chevron-down" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map((item, index) => {
            const isSelected = selectedValue === item;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.item,
                  isSelected && styles.selectedItem,
                ]}
                onPress={() => onSelect(item)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.text,
                    isSelected && styles.selectedText,
                  ]}
                >
                  {item}
                </Text>

                {isSelected && (
                  <Ionicons name="checkmark" size={16} color="#81B29A" />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default PickerModal;
const styles = StyleSheet.create({
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "flex-end",
    },
  
    container: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: "60%",
    },
  
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
  
    title: {
      fontSize: 18,
      fontFamily: "WorkSansBold",
      color: "#3D405B",
    },
  
    closeBtn: {
      backgroundColor: "#81B29A",
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    },
  
    item: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: "#eee",
      borderRadius: 10,
      marginBottom: 10,
    },
  
    selectedItem: {
      borderColor: "#81B29A",
      backgroundColor: "#f7fbf9",
    },
  
    text: {
      fontSize: 16,
      fontFamily: "WorkSansRegular",
    },
  
    selectedText: {
      color: "#81B29A",
      fontFamily: "WorkSansSemiBold",
    },
  });