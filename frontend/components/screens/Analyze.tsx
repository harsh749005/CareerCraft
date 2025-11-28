import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const Analyze = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analyze Report</Text>
      </View>
      <View style={{justifyContent:"center",alignItems:"center"}}>
      <TouchableOpacity style={styles.buildButton}>
        <Text style={styles.buildButtonText}>Analyze</Text>
      </TouchableOpacity>
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
