import { getCategoryById } from "@/constants/mockData";
import { trxType } from "@/constants/types";
import { InnerHeader } from "@/core/components/InnerHeader";
import { getAllTransactions } from "@/core/utils/dbQueries";
import { formatTransactionDateTime } from "@/core/utils/formatValue";
import { normalizeFont, scale, verticalScale } from "@/core/utils/scaling";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AllTransactionScreen() {
  const [transactions, setTransactions] = useState<trxType[]>([]);

  const fetchTransactions = useCallback(() => {
    const data = getAllTransactions();
    setTransactions(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [fetchTransactions]),
  );

  const renderTrxCard = ({ item }: { item: trxType }) => {
    const trxKind = item.type || "Expense";
    const category = getCategoryById(
      item.category_id || item.categoryId,
      trxKind,
    );
    const categoryName = category?.name ?? "Other";
    const categoryIcon =
      category?.icon ?? require("@/assets/images/category/other.png");
    const categoryColor = category?.color ?? "#52B3AD";

    const isIncome = trxKind === "Income";
    const amountColor = isIncome ? "#00A86B" : "#CD5C5C";
    const prefix = isIncome ? "+₹" : "-₹";
    const numericAmount = Math.abs(Number(item.amount) || 0);

    return (
      <View style={styles.card}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: `${categoryColor}20` },
          ]}
        >
          <Image
            source={categoryIcon}
            style={[styles.categoryIcon, { tintColor: categoryColor }]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.categoryName} numberOfLines={1}>
            {categoryName}
          </Text>
          <Text style={styles.dateText}>
            {formatTransactionDateTime(item.date, item.time)}
            {item.note ? ` • ${item.note.slice(0, 15)}...` : ""}
          </Text>
        </View>

        <Text style={[styles.amountText, { color: amountColor }]}>
          {prefix}
          {numericAmount}
        </Text>
      </View>
    );
  };

  const renderEmptyCard = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No transactions found</Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#1B1B1B" }}
      edges={["top"]}
    >
      <StatusBar barStyle={"light-content"} />
      <InnerHeader label="All Transactions" />
      <View style={styles.container}>
        <FlatList
          renderItem={renderTrxCard}
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyCard}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  listContent: {
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(30),
    paddingHorizontal: scale(16),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#343434",
    backgroundColor: "#1B1B1B",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14),
    marginVertical: verticalScale(6),
    borderRadius: scale(12),
  },
  iconWrapper: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIcon: {
    width: scale(24),
    height: scale(24),
  },
  cardInfo: {
    flex: 1,
    marginLeft: scale(12),
    marginRight: scale(8),
  },
  categoryName: {
    color: "#FFFFFF",
    fontSize: normalizeFont(16),
    fontFamily: "GilroySemiBold",
  },
  dateText: {
    color: "#8E8E93",
    fontSize: normalizeFont(12),
    fontFamily: "GilroyMedium",
    marginTop: verticalScale(2),
  },
  amountText: {
    color: "#FFFFFF",
    fontSize: normalizeFont(16),
    fontFamily: "GilroyBold",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(80),
  },
  emptyText: {
    color: "#8E8E93",
    fontSize: normalizeFont(16),
    fontFamily: "GilroyMedium",
  },
});
