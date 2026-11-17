import { PaymentModeType } from "@/constants/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from "expo-router";
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
import { formatToINRWithSymbol, isNegativeAmount } from "../utils/formatValue";
import { normalizeFont, scale, verticalScale } from "../utils/scaling";
import { ToggleSwitch } from "./ToggleSwitch";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedId: string | null) => void;
  categories: PaymentModeType[];
  selectedId: string | null;
}

export const PaymentModeModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  onApply,
  categories,
  selectedId: initialSelectedId,
}) => {
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(
    initialSelectedId,
  );
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(visible);
  const [isEnabledCash, setIsEnabledCash] = useState(false);
  const [isEnabledBank, setIsEnabledBank] = useState(false);
  const toggleSwitchCash = () =>
    setIsEnabledCash((previousState) => !previousState);
  const toggleSwitchBank = () =>
    setIsEnabledBank((previousState) => !previousState);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const cashCategories = categories.filter(
    (category) => category.type === "cash",
  );
  const bankCategories = categories.filter(
    (category) => category.type === "bank",
  );
  const isCashAvailable = Number(cashCategories[0]?.balance ?? 0) > 0;
  const isBankAvailable = Number(bankCategories?.length) > 0;

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

          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {!isCashAvailable && !isBankAvailable && (
            <View style={styles.emptyCard}>
              <Image
                source={require("@/assets/images/noBankIcon.png")}
                style={styles.bankIcon}
              />
              <Text style={styles.emptyCardText}>
                No cash balance or bank accounts{`\n`}added yet
              </Text>
              <TouchableOpacity
                style={styles.walletButton}
                onPress={() => {
                  onClose();
                  navigation.navigate("wallet");
                }}
              >
                <Text style={styles.walletButtonText}>Add Cash/Account</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* CASH SECTION */}

          {isCashAvailable && (
            <>
              <View style={styles.headerContainer}>
                <View style={styles.headerInnerContainer}>
                  <Image
                    source={require("@/assets/images/category/cash.png")}
                    style={styles.headerCashIcon}
                  />
                  <Text style={styles.headerCashTitle}>Cash</Text>
                </View>
                <View style={[styles.headerInnerContainer, { gap: scale(20) }]}>
                  <Text style={styles.toggleTitle}>Show Balance</Text>
                  <ToggleSwitch
                    value={isEnabledCash}
                    onValueChange={toggleSwitchCash}
                    activeColor="#7C7C7C"
                  />
                </View>
              </View>
              <View style={styles.optionsList}>
                {categories
                  .filter((category) => category.type === "cash")
                  .map((category) => {
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
                        <View style={{ flexDirection: "row", gap: 10 }}>
                          <View
                            style={[
                              styles.radioOuter,
                              isSelected && styles.radioOuterSelected,
                            ]}
                          >
                            {isSelected && <View style={styles.radioInner} />}
                          </View>
                          <View style={styles.categoryLeft}>
                            <Text style={styles.optionText}>
                              {category.name}
                            </Text>
                          </View>
                        </View>
                        <View>
                          {isEnabledCash ? (
                            <Text
                              style={[
                                styles.optionText,
                                isNegativeAmount(category.balance ?? "")
                                  ? styles.red
                                  : styles.green,
                              ]}
                            >
                              {formatToINRWithSymbol(category.balance ?? "")}
                            </Text>
                          ) : (
                            <Text style={styles.hiddenAmount}>•••••</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </>
          )}

          {/* BANK SECTION */}
          {isBankAvailable && (
            <>
              <View style={styles.headerContainer}>
                <View style={styles.headerInnerContainer}>
                  <Image
                    source={require("@/assets/images/category/bank.png")}
                    style={styles.headerBankIcon}
                  />
                  <Text style={styles.headerCashTitle}>Banks</Text>
                </View>
                <View style={[styles.headerInnerContainer, { gap: scale(20) }]}>
                  <Text style={styles.toggleTitle}>Show Balance</Text>
                  <ToggleSwitch
                    value={isEnabledBank}
                    onValueChange={toggleSwitchBank}
                    activeColor="#7C7C7C"
                  />
                </View>
              </View>
              <View style={styles.optionsList}>
                {categories
                  .filter((category) => category.type === "bank")
                  .map((category) => {
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
                        <View style={{ flexDirection: "row", gap: 10 }}>
                          <View
                            style={[
                              styles.radioOuter,
                              isSelected && styles.radioOuterSelected,
                            ]}
                          >
                            {isSelected && <View style={styles.radioInner} />}
                          </View>
                          <View style={styles.categoryLeft}>
                            <Text style={styles.optionText}>
                              {category.name}
                            </Text>
                          </View>
                        </View>
                        <View>
                          {isEnabledBank ? (
                            <Text
                              style={[
                                styles.optionText,
                                isNegativeAmount(category.balance ?? "")
                                  ? styles.red
                                  : styles.green,
                              ]}
                            >
                              {formatToINRWithSymbol(category.balance ?? "")}
                            </Text>
                          ) : (
                            <Text style={styles.hiddenAmount}>•••••</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </>
          )}
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
    marginBottom: verticalScale(34),
  },
  dragHandle: {
    width: scale(40),
    height: verticalScale(4),
    backgroundColor: "#D1D5DB",
    borderRadius: scale(2),
  },
  modalTitleContainer: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontFamily: "GilroySemiBold",
    fontSize: normalizeFont(22),
    color: "#FFFFFF",
  },
  optionsList: {
    flexDirection: "column",
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(24),
  },
  optionRow: {
    // width: "25%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(20),
    paddingHorizontal: verticalScale(15),
    borderWidth: scale(1),
    gap: verticalScale(15),
    borderColor: "#252529",
    borderRadius: scale(20),
    marginBottom: scale(20),
  },
  imageWrapper: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(48),
    // opacity: scale(0.5),
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
    fontSize: normalizeFont(16),
    fontFamily: "GilroyMedium",
    textAlign: "center",
    color: "#FFFFFF",
    letterSpacing: scale(0.5),
  },
  selectedOptionText: {
    fontSize: normalizeFont(15),
    fontFamily: "GilroyMedium",
    color: "#52B3AD",
  },
  radioOuter: {
    width: scale(15),
    height: scale(15),
    borderRadius: scale(30),
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: "#D1D5DB",
  },
  radioInner: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: "#D1D5DB",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",

    // marginBottom: verticalScale(5),
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(7),
    justifyContent: "space-between",
  },
  headerInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCashTitle: {
    fontFamily: "GilroyMedium",
    fontSize: normalizeFont(14),
    color: "#BFC6C4",
    marginLeft: scale(12),
  },
  headerCashIcon: {
    width: scale(32),
    height: scale(32),
    tintColor: "#00A86B",
  },
  headerBankIcon: {
    width: scale(25),
    height: scale(25),
    tintColor: "#FF8C00",
    marginBottom: scale(7),
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: normalizeFont(14),
    fontFamily: "GilroyRegular",
    color: "#111418",
    flex: 1,
  },
  toggleTrack: {
    width: scale(44),
    height: scale(24),
    borderRadius: scale(14),
    justifyContent: "center",
  },
  toggleThumb: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(12),
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleContainer: {
    width: scale(44),
    height: scale(24),
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleTitle: {
    fontFamily: "GilroyLight",
    fontSize: normalizeFont(13),
    color: "#BFC6C4",
  },
  red: {
    color: "#CD5C5C",
  },
  green: {
    color: "#00A86B",
  },
  hiddenAmount: {
    fontSize: normalizeFont(16),
    fontFamily: "GilroyMedium",
    color: "#BFC6C4",
    letterSpacing: scale(1),
  },
  emptyCard: {
    // flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(25),
  },
  bankIcon: {
    width: scale(100),
    height: scale(100),
    tintColor: "#353434",
    marginVertical: verticalScale(12),
  },
  emptyCardText: {
    fontFamily: "GilroyMedium",
    color: "#4a4a4aff",
    fontSize: normalizeFont(18),
    textAlign: "center",
  },
  walletButton: {
    backgroundColor: "#52B3AD",
    padding: verticalScale(15),
    borderRadius: scale(12),
    marginTop: verticalScale(12),
    // width: scale(150),
  },
  walletButtonText: {
    fontFamily: "GilroyBold",
    color: "#111418",
    fontSize: normalizeFont(14),
    textAlign: "center",
  },
});
