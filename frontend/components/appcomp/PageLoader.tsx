import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

type PageLoaderProps = {
  onAnimationFinish?: () => void;
};

export default function PageLoader({ onAnimationFinish }: PageLoaderProps) {
  // ✅ Tell TypeScript this ref will hold a LottieView instance
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    animation.current?.play();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        source={{ uri: "https://cdn.lottielab.com/l/5rcVpA6FUQ1g6L.json" }}
        autoPlay
        loop={false}
        onAnimationFinish={onAnimationFinish}
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  animation: {
    width: 250,
    height: 250,
  },
});
