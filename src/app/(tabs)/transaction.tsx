import { getExpenseCategoryItems } from "@/constants/mockData";
import {
  TRANSACTION_COLORS,
  TransactionType,
} from "@/constants/transactionColors";
import { ExpenseCategoryModal } from "@/core/components/ExpenseCategoryModal";
import { InnerHeader } from "@/core/components/InnerHeader";
import { SegmentControl } from "@/core/components/SegmentControl";
import { normalizeFont, scale, verticalScale } from "@/core/utils/scaling";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useFocusEffect } from "expo-router";
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
  const [selectedOption, setSelectedOption] =
    useState<TransactionType>("Expense");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isCatgeoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [selectedCatgeoryId, setSelectedCatgeoryId] = useState<string | null>(
    null,
  );
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const categories = getExpenseCategoryItems();
  const selectedCategory = categories.find((c) => c.id === selectedCatgeoryId);

  const inputRef = useRef<TextInput>(null);
  const activeColor = TRANSACTION_COLORS[selectedOption];

  useFocusEffect(
    useCallback(() => {
      setSelectedOption("Expense");
      setSelectedDate(new Date());
      setSelectedTime(new Date());
      setAmount("");
      setNote("");

      const task = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(task);
    }, []),
  );

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
                  onChangeText={setAmount}
                />
              </View>
            </View>
            <View>
              <View style={styles.labelContainer}>
                <Text style={styles.amountLabel}>Category</Text>
              </View>
              <TouchableOpacity
                style={styles.categoryButton}
                activeOpacity={0.9}
                onPress={() => setIsCategoryModalVisible(true)}
              >
                <View style={styles.amountInputContainer}>
                  {selectedCategory?.icon ? (
                    <Image
                      source={selectedCategory.icon}
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
                      {selectedCategory ? selectedCategory.name : "Category"}
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
            </View>
            <View>
              <View style={styles.labelContainer}>
                <Text style={styles.amountLabel}>Payment mode</Text>
              </View>
              <TouchableOpacity
                style={styles.categoryButton}
                activeOpacity={0.9}
              >
                <View style={styles.amountInputContainer}>
                  <Ionicons name="cash-outline" size={24} color={activeColor} />
                  <View style={styles.categoryContainer}>
                    <Text style={styles.categoryText}>Cash</Text>
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
        visible={isCatgeoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
        onApply={(id) => {
          setSelectedCatgeoryId(id);
          setIsCategoryModalVisible(false);
        }}
        categories={categories}
        selectedId={selectedCatgeoryId}
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
});
