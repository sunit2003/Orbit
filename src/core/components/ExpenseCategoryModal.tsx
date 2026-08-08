import { ExpenseCategoryType } from "@/constants/types";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { normalizeFont, scale, verticalScale } from "../utils/scaling";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ExpenseCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedId: string | null) => void;
  categories: ExpenseCategoryType[];
  selectedId: string | null;
}

export const ExpenseCategoryModal: React.FC<ExpenseCategoryModalProps> = ({
  visible,
  onClose,
  onApply,
  categories,
  selectedId: initialSelectedId,
}) => {
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(
    initialSelectedId,
  );
  const [modalVisible, setModalVisible] = useState(visible);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Sync local state when modal opens
  useEffect(() => {
    if (visible) {
      setLocalSelectedId(initialSelectedId);
      setModalVisible(true);

      // Slide up bottom sheet and fade in backdrop together
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out overlay and slide down simultaneously
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start((result) => {
        if (result.finished) {
          setModalVisible(false);
        }
      });
    }
  }, [visible]);

  const handleApply = () => {
    onApply(localSelectedId);
  };

  const handleClearAll = () => {
    setLocalSelectedId(null);
    onApply(null);
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none" // Turn off native animation
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.bottomSheet, { transform: [{ translateY }] }]}
        >
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          <View style={styles.optionsList}>
            {categories.map((category) => {
              const isSelected = localSelectedId === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={styles.optionRow}
                  onPress={() => {
                    setLocalSelectedId(category.id);
                    onApply(category.id);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryLeft}>
                    <View
                      style={[
                        isSelected
                          ? [
                              styles.isCategorySelected,
                              { backgroundColor: category.color },
                            ]
                          : styles.imageWrapper,
                      ]}
                    >
                      <Image
                        source={category.icon}
                        style={styles.categoryIcon}
                        tintColor={isSelected ? "#000000" : category.color}
                        resizeMode="contain"
                      />
                    </View>

                    <Text
                      style={[
                        styles.optionText,
                        isSelected
                          ? { color: category.color }
                          : { color: "#FFFFFF" },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </View>
                  {/* <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View> */}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  bottomSheet: {
    backgroundColor: "#111111",
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
    paddingHorizontal: scale(5),
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(16),
  },
  dragHandleContainer: {
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  dragHandle: {
    width: scale(40),
    height: verticalScale(4),
    backgroundColor: "#D1D5DB",
    borderRadius: scale(2),
  },
  optionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: verticalScale(24),
  },
  optionRow: {
    width: "25%",
    alignItems: "center",
    paddingVertical: verticalScale(10),
  },
  imageWrapper: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(48),
    opacity: scale(0.5),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(2),
  },
  isCategorySelected: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(48),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(2),
  },
  categoryLeft: {
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor: "red",
  },
  categoryIcon: {
    width: scale(35),
    height: scale(35),
  },
  optionText: {
    fontSize: normalizeFont(14),
    fontFamily: "GilroyMedium",
    textAlign: "center",
  },
  selectedOptionText: {
    fontSize: normalizeFont(14),
    fontFamily: "GilroyMedium",
    color: "#52B3AD",
  },
});
