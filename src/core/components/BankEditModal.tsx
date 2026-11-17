import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import React, { useEffect, useRef, useState } from "react";

import { PaymentModeType } from "@/constants/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  deleteBankAccountById,
  getBankById,
  updateBankDetails,
} from "../utils/dbQueries";
import { formatToINRWithSymbol, isNegativeAmount } from "../utils/formatValue";
import { normalizeFont, scale, verticalScale } from "../utils/scaling";
import { AppPopup } from "./AppPopup";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BankEditModalProps {
  id: string;
  visible: boolean;
  onClose: () => void;
  onBankUpdated?: (result: {
    success: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  }) => void;
}

export const BankEditModal: React.FC<BankEditModalProps> = ({
  id,
  visible,
  onClose,
  onBankUpdated,
}) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const nameInputRef = useRef<TextInput>(null);
  const inputRef = useRef<TextInput>(null);
  const [bankDetails, setBankDetails] = useState<PaymentModeType | null>(null);

  const handleConfirmDelete = () => {
    try {
      deleteBankAccountById(id);
      setIsDeleteConfirmVisible(false);
      onClose();
      onBankUpdated?.({
        success: true,
        title: "Success",
        message: "Bank account deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to delete bank account:", error);
      setIsDeleteConfirmVisible(false);
      onBankUpdated?.({
        success: false,
        title: "Error",
        message: "Failed to delete bank account. Please try again.",
        type: "error",
      });
    }
  };

  const handleUpdateBank = () => {
    let hasError = false;

    if (!bankName.trim()) {
      setNameError("Bank name is required.");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!amount.trim()) {
      setAmountError("Current bank balance is required.");
      hasError = true;
    } else if (isNaN(Number(amount))) {
      setAmountError("Please enter a valid numeric balance.");
      hasError = true;
    } else {
      setAmountError("");
    }

    if (hasError) return;

    try {
      const trimmedName = bankName.trim();
      const numericBalance = Number(amount);
      updateBankDetails(id, trimmedName, numericBalance);

      setBankDetails((prev) =>
        prev
          ? {
              ...prev,
              name: trimmedName,
              balance: String(numericBalance),
            }
          : null,
      );

      setIsEditing(false);
      setAmountError("");
      setNameError("");
      onBankUpdated?.({
        success: true,
        title: "Success",
        message: "Bank account updated successfully!",
        type: "success",
      });
      onClose();
    } catch (error) {
      console.error("Failed to update bank details:", error);
      onBankUpdated?.({
        success: false,
        title: "Error",
        message: "Failed to update bank account. Please try again.",
        type: "error",
      });
    }
  };

  // Sync state and run animations when visibility changes
  useEffect(() => {
    if (visible) {
      const bank = getBankById(id);
      setBankDetails(bank);
      setIsEditing(false);
      setNameError("");
      setAmountError("");
      setBankName(bank?.name ?? "");
      setAmount(bank?.balance ? String(bank.balance) : "");
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
      setIsEditing(false);
      setAmountError("");
      setNameError("");
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

  console.log("Bank details>>>>>>", bankDetails);
  const handleDeleteBank = () => {
    deleteBankAccountById(id);
    onClose();
    onBankUpdated?.({
      success: true,
      title: "Success",
      message: "Bank account deleted successfully!",
      type: "success",
    });
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none" // Turn off native animation
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
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
              <View style={styles.bankNameContainer}>
                <Text style={styles.modalTitle}>
                  {(bankDetails?.name?.length ?? 0) > 20
                    ? bankDetails?.name?.slice(0, 15) + "..."
                    : bankDetails?.name}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const nextState = !isEditing;
                    setIsEditing(nextState);
                    if (nextState) {
                      setTimeout(() => nameInputRef.current?.focus(), 100);
                    }
                  }}
                  style={{
                    borderRadius: scale(20),
                    borderColor: "#52B3AD",
                    borderWidth: scale(1),
                    padding: verticalScale(3),
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="edit" size={18} color="#52B3AD" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalAmountContainer}>
              <Text
                style={[
                  styles.secondaryAmount,
                  isNegativeAmount(bankDetails?.balance ?? amount) &&
                    styles.red,
                ]}
              >
                {formatToINRWithSymbol(bankDetails?.balance ?? amount)}
              </Text>
              <View style={styles.editPromptContainer}>
                <Text style={styles.promptText}>Incorrect Details?</Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    const nextState = !isEditing;
                    setIsEditing(nextState);
                    if (nextState) {
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }
                  }}
                >
                  <Text style={styles.editText}>
                    {isEditing ? "Cancel" : "Edit"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {isEditing && (
              <>
                <View style={styles.cardContainer}>
                  <View style={{ marginTop: verticalScale(10) }}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.amountLabel}>Bank Name</Text>
                    </View>
                    <View
                      style={[
                        styles.amountInputContainer,
                        !!nameError && styles.errorBorder,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="alphabetical-variant"
                        size={24}
                        color={nameError ? "#FF4D4D" : "#52B3AD"}
                      />
                      <TextInput
                        ref={nameInputRef}
                        keyboardType="default"
                        placeholder="Bank Name"
                        cursorColor="#52B3AD"
                        placeholderTextColor="#8E8E93"
                        style={styles.amountInput}
                        value={bankName}
                        onChangeText={(val) => {
                          setBankName(val);
                          if (nameError) setNameError("");
                        }}
                      />
                    </View>
                    {!!nameError && (
                      <Text style={styles.errorText}>{nameError}</Text>
                    )}
                  </View>

                  <View style={{ marginTop: verticalScale(16) }}>
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
                        ref={inputRef}
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
                    onPress={handleUpdateBank}
                    style={[
                      styles.button,
                      { backgroundColor: "#52B3AD", shadowColor: "#52B3AD" },
                    ]}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <TouchableOpacity
              onPress={() => setIsDeleteConfirmVisible(true)}
              style={styles.deleteBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteText}>Delete account</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>

      <AppPopup
        isVisible={isDeleteConfirmVisible}
        type="warning"
        title="Delete Bank Account"
        message="Are you sure you want to delete this bank account?"
        primaryButtonText="Delete"
        onPrimaryPress={handleConfirmDelete}
        secondaryButtonText="Cancel"
        onSecondaryPress={() => setIsDeleteConfirmVisible(false)}
        onClose={() => setIsDeleteConfirmVisible(false)}
      />
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
    minHeight: SCREEN_HEIGHT * 0.8,
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
    marginBottom: verticalScale(10),
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
    // flex: 1,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(30),
    borderRadius: 20,
    alignItems: "center",
    borderColor: "transparent",
    borderWidth: scale(0.5),
    elevation: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: normalizeFont(18),
    fontFamily: "GilroySemiBold",
  },
  modalAmountContainer: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: scale(1),
    borderColor: "#52B3AD",
    borderRadius: scale(10),
    paddingVertical: verticalScale(15),
    marginHorizontal: scale(15),
  },
  secondaryAmount: {
    fontFamily: "GilroySemiBold",
    color: "#FFFFFF",
    fontSize: normalizeFont(25),
  },
  red: {
    color: "#CD5C5C",
  },
  editPromptContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },
  promptText: {
    fontFamily: "GilroyMedium",
    color: "#8E8E93",
    fontSize: normalizeFont(12),
  },
  editText: {
    fontFamily: "GilroySemiBold",
    color: "#52B3AD",
    fontSize: normalizeFont(12),
  },
  nameText: {
    fontFamily: "GilroySemiBold",
    color: "#52B3AD",
    fontSize: normalizeFont(20),
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(10),
  },
  deleteBtn: {
    marginTop: "auto",
    marginBottom: verticalScale(16),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(30),
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: scale(20),
    backgroundColor: "#780000",
  },
  deleteText: {
    fontFamily: "GilroyMedium",
    color: "#FFFFFF",
    fontSize: normalizeFont(14),
    textAlign: "center",
  },
  bankNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: scale(10),
  },
});
