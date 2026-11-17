import { PaymentModeType } from "@/constants/types";
import { AddAccountModal } from "@/core/components/AddAccountModal";
import { AddCashModal } from "@/core/components/AddCashModal";

import { AppPopup } from "@/core/components/AppPopup";
import { BankEditModal } from "@/core/components/BankEditModal";
import { getBanks, getCash, getTotalBalance } from "@/core/utils/dbQueries";
import {
  formatToINRWithSymbol,
  isNegativeAmount,
} from "@/core/utils/formatValue";
import { normalizeFont, scale, verticalScale } from "@/core/utils/scaling";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WalletScreen() {
  const navigation = useNavigation<any>();
  const [banks, setBanks] = useState<PaymentModeType[]>([]);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [cashModalOpen, setCashModalOpen] = useState(false);
  const [bankEditModalOpen, setBankEditModalOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [totalBalance, setTotalBalance] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);

  const fetchBalance = () => {
    const result = getBanks();
    setBanks(result);
    setTotalBalance(getTotalBalance());
    setCashBalance(getCash());
  };

  // AppPopup config state
  const [popup, setPopup] = useState<{
    visible: boolean;
    type: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  }>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });

  useFocusEffect(
    useCallback(() => {
      fetchBalance();
    }, []),
  );

  const handleAccountAdded = (result: {
    success: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  }) => {
    // If it succeeded, reload the bank list dynamically
    if (result.success) {
      fetchBalance();
    }
    // Show the confirmation popup
    setPopup({
      visible: true,
      type: result.type,
      title: result.title,
      message: result.message,
    });
  };

  const handleCashAdded = (result: {
    success: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  }) => {
    // If it succeeded, reload the bank list dynamically
    if (result.success) {
      fetchBalance();
    }
    // Show the confirmation popup
    setPopup({
      visible: true,
      type: result.type,
      title: result.title,
      message: result.message,
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#1B1B1B" }}
      edges={["top"]}
    >
      <StatusBar barStyle={"light-content"} />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("home");
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={scale(20)} color="#FFFFFF" />
          <Text style={styles.headerTitle}>All Accounts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setAccountModalOpen(true);
          }}
        >
          <Ionicons name="add" size={14} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add New Account</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.balanceContainer}>
            <View style={styles.balanceBox}>
              <View style={styles.balanceHeader}>
                <View style={styles.balanceTitleContainer}>
                  <Text style={styles.balanceBoxTitle}>Available Balance</Text>
                  <TouchableOpacity style={{ marginTop: scale(4) }}>
                    <MaterialIcons
                      name="info-outline"
                      size={14}
                      color="#52B3AD"
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity>
                  <Ionicons name="eye-outline" size={20} color="#FFFFFF" />
                  {/* <Ionicons name="eye-off-outline" size={20} color="#FFFFFF" /> */}
                </TouchableOpacity>
              </View>
              <View style={styles.balanceAmountContainer}>
                <Text
                  style={[
                    styles.balanceAmount,
                    isNegativeAmount(totalBalance) && styles.red,
                  ]}
                >
                  {formatToINRWithSymbol(totalBalance)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.amountInputContainer}>
            <Ionicons name="cash-outline" size={20} color="#52B3AD" />
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>Cash</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.secondaryContainer}
            onPress={() => setCashModalOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryTitle}>Cash</Text>
            <View style={styles.secondaryBox}>
              <Text
                style={[
                  styles.secondaryAmount,
                  isNegativeAmount(cashBalance) && styles.red,
                ]}
              >
                {formatToINRWithSymbol(cashBalance)}
              </Text>
              <Ionicons name="chevron-forward" size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.amountInputContainer}>
            <MaterialCommunityIcons name="bank" size={20} color="#52B3AD" />
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>
                {banks.length > 1 ? "Bank Accounts" : "Bank Account"}
              </Text>
            </View>
          </View>
          {banks.map((bank) => {
            const bankName = bank.name ?? "";
            const bankBalance = bank.balance ?? "0";
            return (
              <TouchableOpacity
                key={bank.id}
                onPress={() => {
                  setSelectedBankId(bank.id);
                  setBankEditModalOpen(true);
                }}
                style={[
                  styles.secondaryContainer,
                  { marginVertical: scale(7) },
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryTitle}>
                  {bankName.length < 20
                    ? bankName
                    : bankName.slice(0, 20) + "..."}
                </Text>
                <View style={styles.secondaryBox}>
                  <Text
                    style={[
                      styles.secondaryAmount,
                      isNegativeAmount(bankBalance) && styles.red,
                    ]}
                  >
                    {formatToINRWithSymbol(parseInt(bankBalance))}
                  </Text>
                  <Ionicons name="chevron-forward" size={12} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            );
          })}
          {banks.length === 0 && (
            <View style={styles.emptyCard}>
              <Image
                source={require("@/assets/images/noBankIcon.png")}
                style={styles.bankIcon}
              />
              <Text style={styles.emptyCardText}>
                No bank accounts added yet
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
      <AddAccountModal
        visible={accountModalOpen}
        onClose={() => {
          setAccountModalOpen(false);
        }}
        onAccountAdded={handleAccountAdded}
      />
      <AddCashModal
        visible={cashModalOpen}
        onClose={() => {
          setCashModalOpen(false);
        }}
        onCashAdded={handleCashAdded}
      />
      {selectedBankId && (
        <BankEditModal
          id={selectedBankId}
          visible={bankEditModalOpen}
          onClose={() => {
            setBankEditModalOpen(false);
          }}
          onBankUpdated={handleAccountAdded}
        />
      )}
      <AppPopup
        isVisible={popup.visible}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        primaryButtonText="OK"
        onPrimaryPress={() => setPopup((prev) => ({ ...prev, visible: false }))}
        onClose={() => setPopup((prev) => ({ ...prev, visible: false }))}
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1B1B1B",
    borderBottomWidth: scale(0.7),
    borderColor: "#343434",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    marginHorizontal: scale(17),
    marginVertical: verticalScale(17),
  },
  headerTitle: {
    // flex: 1,
    color: "#FFFFFF",
    fontSize: normalizeFont(22),
    fontFamily: "GilroySemiBold",
    marginLeft: verticalScale(16),
  },
  addButton: {
    flexDirection: "row",
    gap: scale(7),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    paddingHorizontal: verticalScale(16),
    marginRight: verticalScale(12),
    backgroundColor: "#161515ff",
    borderRadius: scale(16),
  },
  addButtonText: {
    fontFamily: "GilroySemiBold",
    color: "#FFFFFF",
    fontSize: normalizeFont(14),
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: verticalScale(30),
  },
  balanceBox: {
    flex: 1,
    marginHorizontal: verticalScale(18),
    backgroundColor: "#161515ff",
    paddingVertical: verticalScale(16),
    paddingHorizontal: verticalScale(16),
    borderRadius: scale(16),
    borderWidth: scale(0.7),
    borderColor: "#343434",
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceTitleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(7),
  },
  balanceBoxTitle: {
    fontFamily: "GilroySemiBold",
    color: "#52B3AD",
    fontSize: normalizeFont(24),
  },
  balanceAmountContainer: {
    flexDirection: "row",
    // justifyContent: "",
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  balanceAmount: {
    fontFamily: "GilroySemiBold",
    color: "#FFFFFF",
    fontSize: normalizeFont(32),
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
  amountInputContainer: {
    marginTop: scale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: scale(24),
  },
  categoryContainer: {
    flex: 1,
    height: scale(40),
    justifyContent: "center",
    marginLeft: scale(12),
    // backgroundColor: "red",
  },
  categoryText: {
    fontFamily: "GilroySemiBold",
    fontSize: normalizeFont(18),
    color: "#FFFFFF",
  },
  secondaryContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: verticalScale(18),
    backgroundColor: "#161515ff",
    paddingVertical: verticalScale(12),
    paddingHorizontal: verticalScale(16),
    borderRadius: scale(20),
    borderWidth: scale(0.7),
    borderColor: "#343434",
  },
  secondaryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: scale(12),
  },
  secondaryTitle: {
    fontFamily: "GilroyMedium",
    color: "#FFFFFF",
    fontSize: normalizeFont(15),
  },
  secondaryAmount: {
    fontFamily: "GilroySemiBold",
    color: "#FFFFFF",
    fontSize: normalizeFont(18),
  },
  emptyCard: {
    flex: 1,
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
  },
});
