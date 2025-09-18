// BarLoader.js
import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";

const BarLoader = ({ size = 40, color = "#000000", bars = 12 }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => spinAnimation.stop();
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const barsArray = Array.from({ length: bars });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.innerContainer,
          { 
            width: size, 
            height: size, 
            transform: [{ rotate }] 
          },
        ]}
      >
        {barsArray.map((_, i) => {
          const angle = (i * 360) / bars;
          const barLength = size * 0.25; // 25% of size
          const barWidth = size * 0.06; // 6% of size
          const borderRadius = barWidth / 2;
          const radius = size * 0.35; // distance from center
          
          // Calculate position for each bar
          const radians = (angle * Math.PI) / 180;
          const x = Math.cos(radians) * radius;
          const y = Math.sin(radians) * radius;
          
          return (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  backgroundColor: color,
                  height: barLength,
                  width: barWidth,
                  borderRadius: borderRadius,
                  position: "absolute",
                  top: size / 2 + y - barLength / 2, // center vertically + offset
                  left: size / 2 + x - barWidth / 2, // center horizontally + offset
                  transform: [{ rotate: `${angle + 90}deg` }], // +90 to align properly
                },
              ]}
            />
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    position: "relative",
  },
  bar: {
    position: "absolute",
  },
});

export default BarLoader;