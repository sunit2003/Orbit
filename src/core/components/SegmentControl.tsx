import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { normalizeFont, scale } from "../utils/scaling";

interface SegmentControlProps {
  options: string[];
  selectedOption?: string;
  onOptionPress?: (option: string) => void;
}

export const SegmentControl: React.FC<SegmentControlProps> = ({
  options,
  selectedOption,
  onOptionPress,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const segmentedControlWidth = windowWidth - 40;
  const paddingValue = scale(5);
  const innerWidth = segmentedControlWidth - paddingValue * 2;
  const itemWidth = innerWidth / options.length;

  const selectedIndex = options.indexOf(selectedOption ?? "");
  const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const animationController = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.spring(animationController, {
      toValue: activeIndex,
      useNativeDriver: true,
      tension: 50,
      friction: 100,
    }).start();
  }, [activeIndex]);

  const translateX = animationController.interpolate({
    inputRange: [0, options.length - 1 || 1],
    outputRange: [0, (options.length - 1 || 1) * itemWidth],
  });

  return (
    <View
      style={[
        styles.container,
        { width: segmentedControlWidth, paddingHorizontal: paddingValue },
      ]}
    >
      <Animated.View
        style={[
          styles.optionStyle,
          {
            width: itemWidth,
            left: paddingValue,
            transform: [{ translateX }],
          },
        ]}
      />
      {options.map((option) => {
        const isSelected = option === selectedOption;
        return (
          <TouchableOpacity
            onPress={() => onOptionPress?.(option)}
            key={option}
            style={{
              width: itemWidth,
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={[styles.text, isSelected && styles.activeText]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161515ff",
    height: scale(40),
    borderRadius: scale(30),
  },
  optionStyle: {
    position: "absolute",
    height: scale(30),
    backgroundColor: "#2F2E2E",
    borderRadius: scale(30),
    top: scale(5),
  },
  text: {
    color: "#8E8E93",
    fontSize: normalizeFont(14),
    fontFamily: "GilroySemiBold",
  },
  activeText: {
    color: "#FFFFFF",
  },
});
