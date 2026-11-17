import {
  getExpenseCategoryItems,
  getIncomeCategoryItems,
} from "@/constants/mockData";
import {
  TRANSACTION_COLORS,
  TransactionType,
} from "@/constants/transactionColors";
import {
  ExpenseCategoryType,
  IncomeCategoryType,
  PaymentModeType,
} from "@/constants/types";
import { AppPopup, PopupType } from "@/core/components/AppPopup";
import { ExpenseCategoryModal } from "@/core/components/ExpenseCategoryModal";
import { IncomeCategoryModal } from "@/core/components/IncomeCategoryModal";
import { InnerHeader } from "@/core/components/InnerHeader";
import { PaymentModeModal } from "@/core/components/PaymentModeModal";
import { SegmentControl } from "@/core/components/SegmentControl";
import { addExpense, getPaymentModes } from "@/core/utils/dbQueries";
import { normalizeFont, scale, verticalScale } from "@/core/utils/scaling";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const options = ["Expense", "Income", "Transfer"];
export default function TransactionScreen() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] =
    useState<TransactionType>("Expense");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isExpenseCatgeoryModalVisible, setIsExpenseCategoryModalVisible] =
    useState(false);
  const [isIncomeCatgeoryModalVisible, setIsIncomeCategoryModalVisible] =
    useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedCatgeoryId, setSelectedCatgeoryId] = useState<string | null>(
    null,
  );
  const [selectedPaymentModeId, setSelectedPaymentModeId] = useState<
    string | null
  >(null);
  const [paymentModalTarget, setPaymentModalTarget] = useState<
    "category" | "paymentMode"
  >("paymentMode");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [amountError, setAmountError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [paymentModeError, setPaymentModeError] = useState("");

  const [popupState, setPopupState] = useState<{
    isVisible: boolean;
    type: PopupType;
    title: string;
    message: string;
  }>({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  });

  const expenseCategories = getExpenseCategoryItems();
  const incomeCategories = getIncomeCategoryItems();
  const paymentModes = getPaymentModes();

  let selectedCategory:
    | ExpenseCategoryType
    | IncomeCategoryType
    | PaymentModeType
    | undefined;
  if (selectedOption === "Expense") {
    selectedCategory = expenseCategories.find(
      (c) => c.id === selectedCatgeoryId,
    );
  } else if (selectedOption === "Income") {
    selectedCategory = incomeCategories.find(
      (c) => c.id === selectedCatgeoryId,
    );
  } else {
    selectedCategory = paymentModes.find((c) => c.id === selectedCatgeoryId);
  }

  const getCategoryIcon = () => {
    if (selectedOption === "Transfer") {
      const paymentMode = selectedCategory as PaymentModeType | undefined;
      return paymentMode?.type === "cash"
        ? require("@/assets/images/category/cash.png")
        : require("@/assets/images/category/bank.png");
    }
    const category = selectedCategory as
      | ExpenseCategoryType
      | IncomeCategoryType
      | undefined;
    return category?.icon;
  };

  const selectedPaymentMode = paymentModes.find(
    (p) => p.id === selectedPaymentModeId,
  );
  const getPaymentModeIcon = () => {
    if (!selectedPaymentMode) return null;
    return selectedPaymentMode.type === "cash"
      ? require("@/assets/images/category/cash.png")
      : require("@/assets/images/category/bank.png");
  };

  const handleCategoryClick = () => {
    if (selectedOption === "Expense") {
      setIsExpenseCategoryModalVisible(true);
    } else if (selectedOption === "Income") {
      setIsIncomeCategoryModalVisible(true);
    } else {
      setPaymentModalTarget("category");
      setIsPaymentModalVisible(true);
    }
  };

  const inputRef = useRef<TextInput>(null);
  const activeColor = TRANSACTION_COLORS[selectedOption];

  useFocusEffect(
    useCallback(() => {
      setSelectedOption("Expense");
      setSelectedDate(new Date());
      setSelectedTime(new Date());
      setAmount("");
      setNote("");
      setSelectedCatgeoryId(null);
      setSelectedPaymentModeId(null);
      setAmountError("");
      setCategoryError("");
      setPaymentModeError("");

      const task = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(task);
    }, []),
  );
  const handleClearForm = () => {
    setAmount("");
    setNote("");
    setSelectedCatgeoryId(null);
    setSelectedPaymentModeId(null);
    setSelectedOption("Expense");
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setAmountError("");
    setCategoryError("");
    setPaymentModeError("");
  };

  const handleAddTransaction = () => {
    let hasError = false;

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError("Please enter a valid amount");
      hasError = true;
    } else {
      setAmountError("");
    }

    if (!selectedCatgeoryId) {
      setCategoryError(
        selectedOption === "Transfer"
          ? "Please select source account"
          : "Please select a category",
      );
      hasError = true;
    } else {
      setCategoryError("");
    }

    if (!selectedPaymentModeId) {
      setPaymentModeError(
        selectedOption === "Transfer"
          ? "Please select destination account"
          : "Please select a payment mode",
      );
      hasError = true;
    } else {
      setPaymentModeError("");
    }

    if (hasError) {
      return;
    }

    try {
      addExpense({
        amount: parsedAmount,
        categoryId: selectedCatgeoryId!,
        paymentModeId: selectedPaymentModeId!,
        date: selectedDate,
        time: selectedTime,
        note,
        type: selectedOption,
      });

      handleClearForm();
      setPopupState({
        isVisible: true,
        type: "success",
        title: "Success",
        message: "Transaction added successfully",
      });
    } catch (error) {
      setPopupState({
        isVisible: true,
        type: "error",
        title: "Error",
        message: "Failed to add transaction. Please try again.",
      });
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#1B1B1B" }}
      edges={["top"]}
    >
      <StatusBar barStyle={"light-content"} />
      <InnerHeader label="Add Transaction" />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.segmentContainer}>
            <SegmentControl
              options={options}
              selectedOption={selectedOption}
              onOptionPress={(option) =>
                setSelectedOption(option as TransactionType)
              }
            />
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.topActionButtons}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={activeColor}
                />
                <Text style={styles.topActionButtonText}>
                  {selectedDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </TouchableOpacity>
              <View style={styles.topActionSepartor} />
              <TouchableOpacity
                style={styles.topActionButtons}
                onPress={() => {
                  setShowTimePicker(true);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="time-outline" size={20} color={activeColor} />
                <Text style={styles.topActionButtonText}>
                  {selectedTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <View style={styles.labelContainer}>
                <Text style={styles.amountLabel}>Amount</Text>
              </View>
              <View style={styles.amountInputContainer}>
                <MaterialIcons
                  name="currency-rupee"
                  size={24}
                  color={activeColor}
                />
                <TextInput
                  ref={inputRef}
                  keyboardType="number-pad"
                  autoFocus={true}
                  placeholder="0"
                  cursorColor={activeColor}
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
            <View>
              <View style={styles.labelContainer}>
                <Text style={styles.amountLabel}>
                  {selectedOption === "Transfer" ? "From" : "Category"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.categoryButton}
                activeOpacity={0.9}
                onPress={handleCategoryClick}
              >
                <View style={styles.amountInputContainer}>
                  {getCategoryIcon() ? (
                    <Image
                      source={getCategoryIcon()}
                      style={styles.categoryIcon}
                      tintColor={activeColor}
                    />
                  ) : (
                    <MaterialIcons
                      name="category"
                      size={24}
                      color={activeColor}
                    />
                  )}
                  <View style={styles.categoryContainer}>
                    <Text style={styles.categoryText}>
                      {selectedCategory?.name || "Category"}
                    </Text>
                  </View>
                  {/* <Text style={styles.amountInput}>Category</Text> */}
                </View>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={activeColor}
                  />
                </View>
              </TouchableOpacity>
              {!!categoryError && (
                <Text style={styles.errorText}>{categoryError}</Text>
              )}
            </View>
            <View>
              <View style={styles.labelContainer}>
                <Text style={styles.amountLabel}>
                  {selectedOption === "Transfer" ? "To" : "Payment mode"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.categoryButton}
                activeOpacity={0.9}
                onPress={() => {
                  setPaymentModalTarget("paymentMode");
                  setIsPaymentModalVisible(true);
                }}
              >
                <View style={styles.amountInputContainer}>
                  {getPaymentModeIcon() ? (
                    <Image
                      source={getPaymentModeIcon()}
                      style={styles.categoryIcon}
                      tintColor={activeColor}
                    />
                  ) : (
                    <Ionicons
                      name="cash-outline"
                      size={24}
                      color={activeColor}
                    />
                  )}
                  <View style={styles.categoryContainer}>
                    <Text style={styles.categoryText}>
                      {selectedPaymentMode?.name ||
                        (selectedOption === "Transfer"
                          ? "Select Account"
                          : "Payment mode")}
                    </Text>
                  </View>
                  {/* <Text style={styles.amountInput}>Category</Text> */}
                </View>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={activeColor}
                  />
                </View>
              </TouchableOpacity>
              {!!paymentModeError && (
                <Text style={styles.errorText}>{paymentModeError}</Text>
              )}
            </View>
            <View>
              <Text style={styles.otherText}>Other details</Text>
            </View>
            <View>
              {/* <View style={styles.labelContainer}>
                <Text style={styles.amountLabel}>Payment mode</Text>
              </View> */}
              <TouchableOpacity
                style={styles.categoryButton}
                activeOpacity={0.9}
              >
                <View style={styles.amountInputContainer}>
                  <MaterialIcons name="notes" size={24} color={activeColor} />
                  <TextInput
                    placeholder="Write a note"
                    cursorColor={activeColor}
                    placeholderTextColor="#8E8E93"
                    style={styles.noteInput}
                    value={note}
                    onChangeText={setNote}
                  />
                  {/* <Text style={styles.amountInput}>Category</Text> */}
                </View>
                {/* <View style={styles.iconContainer}>
                  <Ionicons name="chevron-forward" size={15} color={activeColor} />
                </View> */}
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: verticalScale(18) }}>
              <TouchableOpacity
                style={styles.categoryButton}
                activeOpacity={0.9}
              >
                <View style={styles.amountInputContainer}>
                  <MaterialIcons
                    name="attachment"
                    size={20}
                    color={activeColor}
                  />
                  <View style={styles.categoryContainer}>
                    <Text style={styles.attachmentText}> Add attachment</Text>
                  </View>
                  {/* <Text style={styles.amountInput}>Category</Text> */}
                </View>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={activeColor}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View style={styles.loginSection}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: activeColor, shadowColor: activeColor },
            ]}
            onPress={handleAddTransaction}
          >
            <Text style={styles.buttonText}>Save Transaction</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showDatePicker && (
        <DateTimePicker
          themeVariant="dark"
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);

            if (date) {
              setSelectedDate(date);
            }
          }}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          themeVariant="dark"
          value={selectedTime}
          mode="time"
          display="default"
          onChange={(event, date) => {
            setShowTimePicker(false);

            if (date) {
              setSelectedTime(date);
            }
          }}
        />
      )}
      <ExpenseCategoryModal
        visible={isExpenseCatgeoryModalVisible}
        onClose={() => setIsExpenseCategoryModalVisible(false)}
        onApply={(id) => {
          setSelectedCatgeoryId(id);
          if (categoryError) setCategoryError("");
          setIsExpenseCategoryModalVisible(false);
        }}
        categories={expenseCategories}
        selectedId={selectedCatgeoryId}
      />
      <IncomeCategoryModal
        visible={isIncomeCatgeoryModalVisible}
        onClose={() => setIsIncomeCategoryModalVisible(false)}
        onApply={(id) => {
          setSelectedCatgeoryId(id);
          if (categoryError) setCategoryError("");
          setIsIncomeCategoryModalVisible(false);
        }}
        categories={incomeCategories}
        selectedId={selectedCatgeoryId}
      />
      <PaymentModeModal
        visible={isPaymentModalVisible}
        onClose={() => setIsPaymentModalVisible(false)}
        onApply={(id) => {
          if (
            selectedOption === "Transfer" &&
            paymentModalTarget === "category"
          ) {
            setSelectedCatgeoryId(id);
            if (categoryError) setCategoryError("");
          } else {
            setSelectedPaymentModeId(id);
            if (paymentModeError) setPaymentModeError("");
          }
          setIsPaymentModalVisible(false);
        }}
        categories={paymentModes}
        selectedId={
          selectedOption === "Transfer" && paymentModalTarget === "category"
            ? selectedCatgeoryId
            : selectedPaymentModeId
        }
      />
      <AppPopup
        isVisible={popupState.isVisible}
        type={popupState.type}
        title={popupState.title}
        message={popupState.message}
        onPrimaryPress={() => {
          setPopupState((prev) => ({ ...prev, isVisible: false }));
          if (popupState.type === "success") {
            router.back();
          }
        }}
        onClose={() => {
          setPopupState((prev) => ({ ...prev, isVisible: false }));
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    // paddingHorizontal: verticalScale(16),
  },
  segmentContainer: {
    marginVertical: verticalScale(26),
    paddingHorizontal: verticalScale(16),
  },
  cardContainer: {
    // backgroundColor: "#1B1B1B",
    paddingHorizontal: verticalScale(16),
  },
  topActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: verticalScale(14),
    backgroundColor: "#161515ff",
    borderRadius: scale(16),
    marginTop: verticalScale(5),
    marginBottom: verticalScale(12),
  },
  topActionButtons: {
    flex: 1,
    flexDirection: "row",
    gap: scale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  topActionButtonText: {
    fontFamily: "GilroySemiBold",
    color: "#FFFFFF",
    fontSize: normalizeFont(14),
  },
  topActionSepartor: {
    width: scale(1.5),
    height: verticalScale(18),
    backgroundColor: "#434346",
  },
  labelContainer: {
    paddingHorizontal: verticalScale(12),
    marginTop: verticalScale(20),
    marginLeft: verticalScale(25),
    // backgroundColor: "red",
  },
  amountLabel: {
    fontFamily: "GilroyLight",
    color: "#8E8E93",
    fontSize: normalizeFont(9),
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#161515ff",
    // borderRadius: scale(12),
    // paddingHorizontal: scale(12),
  },
  amountInput: {
    flex: 1,
    fontFamily: "GilroyMedium",
    color: "#FFFFFF",
    fontSize: normalizeFont(20),
    paddingVertical: verticalScale(12),
    marginLeft: scale(6),
    letterSpacing: scale(1),
  },
  categoryContainer: {
    flex: 1,
    height: scale(40),
    justifyContent: "center",
    marginLeft: scale(12),
  },
  categoryText: {
    fontFamily: "GilroySemiBold",
    fontSize: normalizeFont(18),
    color: "#FFFFFF",
  },
  categoryIcon: {
    width: scale(24),
    height: scale(24),
  },
  categoryButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: scale(20),
  },
  iconContainer: {
    marginRight: scale(16),
  },
  otherText: {
    fontFamily: "GilroySemiBold",
    fontSize: normalizeFont(16),
    color: "#FFFFFF",
    // marginLeft: verticalScale(28),
    marginTop: verticalScale(35),
    marginBottom: verticalScale(10),
  },
  noteInput: {
    flex: 1,
    fontFamily: "GilroyMedium",
    color: "#FFFFFF",
    fontSize: normalizeFont(16),
    paddingVertical: verticalScale(12),
    marginLeft: scale(6),
    // letterSpacing: scale(1),
  },
  attachmentText: {
    fontFamily: "GilroySemiBold",
    fontSize: normalizeFont(16),
    color: "#8E8E93",
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
  errorText: {
    color: "#FF453A",
    fontSize: normalizeFont(12),
    fontFamily: "GilroyMedium",
    marginTop: verticalScale(4),
    marginLeft: scale(4),
  },
});
