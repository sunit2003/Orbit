import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { addAccount } from "../utils/dbQueries";
import { normalizeFont, scale, verticalScale } from "../utils/scaling";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AddAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onAccountAdded?: (result: {
    success: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  }) => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  visible,
  onClose,
  onAccountAdded,
}) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [bankName, setBankName] = useState("");
  const [amount, setAmount] = useState("");
  const [bankNameError, setBankNameError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleAddAccount = (name: string, balance: string) => {
    let hasError = false;

    if (!name.trim()) {
      setBankNameError("Bank account name is required.");
      hasError = true;
    } else {
      setBankNameError("");
    }

    if (!balance.trim()) {
      setAmountError("Current balance is required.");
      hasError = true;
    } else if (isNaN(Number(balance))) {
      setAmountError("Please enter a valid numeric balance.");
      hasError = true;
    } else {
      setAmountError("");
    }

    if (hasError) return;

    try {
      addAccount(name.trim(), Number(balance));
      setBankName("");
      setAmount("");
      setBankNameError("");
      setAmountError("");
      onAccountAdded?.({
        success: true,
        title: "Success",
        message: `Account "${name.trim()}" added successfully!`,
        type: "success",
      });
      onClose();
    } catch (error) {
      onAccountAdded?.({
        success: false,
        title: "Error",
        message: "Failed to add account. Please try again.",
        type: "error",
      });
    }
  };

  // Sync state and run animations when visibility changes
  useEffect(() => {
    if (visible) {
      setModalVisible(true);
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
      setBankNameError("");
      setAmountError("");
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

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none" // Turn off native animation
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingBottom: keyboardHeight }]}>
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
              <Text style={styles.modalTitle}>Add New Account</Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.cardContainer}>
              <View>
                <View style={styles.labelContainer}>
                  <Text style={styles.amountLabel}>Bank Account Name</Text>
                </View>
                <View
                  style={[
                    styles.amountInputContainer,
                    !!bankNameError && styles.errorBorder,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="alphabetical-variant"
                    size={24}
                    color={bankNameError ? "#FF4D4D" : "#52B3AD"}
                  />
                  <TextInput
                    ref={inputRef}
                    autoFocus={true}
                    placeholder="Bank name"
                    cursorColor="#52B3AD"
                    placeholderTextColor="#8E8E93"
                    style={styles.amountInput}
                    value={bankName}
                    onChangeText={(val) => {
                      setBankName(val);
                      if (bankNameError) setBankNameError("");
                    }}
                  />
                </View>
                {!!bankNameError && (
                  <Text style={styles.errorText}>{bankNameError}</Text>
                )}
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <View style={styles.labelContainer}>
                  <Text style={styles.amountLabel}>Current Balance</Text>
                </View>
                <View
                  style={[
                    styles.amountInputContainer,
                    !!amountError && styles.errorBorder,
                  ]}
                >
                  <MaterialIcons
                    name="currency-rupee"
                    size={24}
                    color={amountError ? "#FF4D4D" : "#52B3AD"}
                  />
                  <TextInput
                    keyboardType="number-pad"
                    placeholder="0"
                    cursorColor="#52B3AD"
                    placeholderTextColor="#8E8E93"
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={(val) => {
                      setAmount(val);
                      if (amountError) setAmountError("");
                    }}
                  />
                </View>
                {!!amountError && (
                  <Text style={styles.errorText}>{amountError}</Text>
                )}
              </View>
            </View>
            <View style={styles.loginSection}>
              <TouchableOpacity
                onPress={() => {
                  handleAddAccount(bankName, amount);
                }}
                style={[
                  styles.button,
                  { backgroundColor: "#52B3AD", shadowColor: "#52B3AD" },
                ]}
              >
                <Text style={styles.buttonText}>Add Account</Text>
              </TouchableOpacity>
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
    backgroundColor: "rgba(0, 0, 0, 0.88)",
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
  cardContainer: {
    paddingHorizontal: verticalScale(16),
    marginBottom: verticalScale(30),
  },
  labelContainer: {
    paddingHorizontal: verticalScale(12),
    marginTop: verticalScale(20),
    marginLeft: verticalScale(25),
  },
  amountLabel: {
    fontFamily: "GilroyLight",
    color: "#8E8E93",
    fontSize: normalizeFont(9),
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: scale(1),
    borderColor: "transparent",
    borderRadius: scale(12),
    paddingHorizontal: scale(10),
  },
  errorBorder: {
    borderColor: "#FF4D4D",
  },
  errorText: {
    fontFamily: "GilroyMedium",
    color: "#FF4D4D",
    fontSize: normalizeFont(11),
    marginLeft: scale(42),
    marginTop: verticalScale(4),
  },
  amountInput: {
    flex: 1,
    fontFamily: "GilroyMedium",
    color: "#FFFFFF",
    fontSize: normalizeFont(20),
    paddingVertical: verticalScale(12),
    marginLeft: scale(6),
  },
  loginSection: {
    paddingHorizontal: verticalScale(16),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(25),
  },
  button: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(48),
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginTop: verticalScale(10),
    borderColor: "transparent",
    borderWidth: scale(0.5),
    elevation: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: normalizeFont(18),
    fontFamily: "GilroySemiBold",
  },
});
