import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import { scale } from "../utils/scaling";

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  activeColor = "#52B3AD",
  inactiveColor = "#2F2E2E",
  thumbColor = "#FFFFFF",
  disabled = false,
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const toggle = () => {
    if (disabled) return;
    onValueChange(!value);
  };

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [scale(-5), scale(16)],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={toggle} disabled={disabled}>
      <Animated.View
        style={[
          styles.track,
          { backgroundColor: trackColor },
          disabled && styles.disabled,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            { backgroundColor: thumbColor, transform: [{ translateX }] },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: scale(35),
    height: scale(15),
    borderRadius: scale(14),
    justifyContent: "center",
    paddingHorizontal: scale(2),
  },
  thumb: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});
