import AvatarContainer from "@/core/components/AvatarContainer";
import BalanceCard from "@/core/components/BalanceCard";
import { getTotalBalance } from "@/core/utils/dbQueries";
import { normalizeFont, scale, verticalScale } from "@/core/utils/scaling";
import { db, getDatabaseTables } from "@/database/database";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
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

export default function HomeScreen() {
  const router = useRouter();
  const [totalBalance, setTotalBalance] = useState<number>(() =>
    getTotalBalance(),
  );

  useFocusEffect(
    useCallback(() => {
      setTotalBalance(getTotalBalance());
    }, []),
  );

  const handlePrintTables = () => {
    try {
      const tables = getDatabaseTables();
      console.log("\n==============================================");
      console.log("🔍 FOUND TABLES:", tables.join(", "));
      console.log("==============================================");

      tables.forEach((table) => {
        // Get column definitions
        const columnsInfo = db.getAllSync<{ name: string }>(
          `PRAGMA table_info(${table});`,
        );
        const colNames = columnsInfo.map((col) => col.name);

        if (colNames.length === 0) return;

        // Fetch rows
        const rows = db.getAllSync<any>(`SELECT * FROM ${table};`);

        // Calculate max width for each column to align properly
        const colWidths: Record<string, number> = {};
        colNames.forEach((name) => {
          colWidths[name] = name.length;
        });

        rows.forEach((row) => {
          colNames.forEach((name) => {
            const val = String(
              row[name] !== null && row[name] !== undefined
                ? row[name]
                : "NULL",
            );
            if (val.length > colWidths[name]) {
              colWidths[name] = val.length;
            }
          });
        });

        // Build the divider line (+-----+-----+...)
        const divider =
          "+" +
          colNames.map((name) => "-".repeat(colWidths[name] + 2)).join("+") +
          "+";

        // Build the header line (| column_name | ...)
        const header =
          "|" +
          colNames
            .map((name) => ` ${name.padEnd(colWidths[name])} `)
            .join("|") +
          "|";

        console.log(`\n📋 TABLE: ${table} (${rows.length} rows)`);
        console.log(divider);
        console.log(header);
        console.log(divider);

        if (rows.length === 0) {
          console.log(`| ${"(empty table)".padEnd(divider.length - 4)} |`);
        } else {
          rows.forEach((row) => {
            const rowStr =
              "|" +
              colNames
                .map((name) => {
                  const val = String(
                    row[name] !== null && row[name] !== undefined
                      ? row[name]
                      : "NULL",
                  );
                  return ` ${val.padEnd(colWidths[name])} `;
                })
                .join("|") +
              "|";
            console.log(rowStr);
          });
        }
        console.log(divider);
      });
      console.log("\n==============================================\n");
    } catch (error) {
      console.error("❌ Error printing database tables:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require("@/assets/images/topBgImage.png")}
          resizeMode="stretch"
          style={styles.headerBg}
        />
        <SafeAreaView>
          <AvatarContainer />
          <View style={styles.headerContainer}>
            <Text style={styles.headerGreetText}>Hello,</Text>
            <Text style={styles.headerText}>sunit!</Text>
          </View>
          <View style={[styles.cardContainer, styles.firstCardOverlap]}>
            <BalanceCard totalBalance={totalBalance} />
          </View>

          <View style={styles.recentTrxContainer}>
            <Text style={styles.recentTrxText}>Last 5 Tranactions</Text>
            <TouchableOpacity
              style={styles.viewAllTrxBtn}
              onPress={() => {
                router.push("/allTransactions");
              }}
            >
              <Text style={styles.recentTrxViewAllText}>View All</Text>
              <Feather name="chevron-right" size={18} color="#52B3AD" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Floating Action Button to Print Tables */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handlePrintTables}
        activeOpacity={0.7}
      >
        <Text style={styles.fabText}>Database</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  cardContainer: {
    marginBottom: verticalScale(20),
    marginTop: -verticalScale(20),
  },
  firstCardOverlap: {
    marginTop: verticalScale(2),
    marginBottom: verticalScale(25),
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(20),
    paddingHorizontal: verticalScale(30),
  },
  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(3),
  },
  haveAccount: {
    fontSize: normalizeFont(14),
    fontFamily: "Gilroy-SemiBold",
    color: "#E5E4E2",
  },
  headerBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: scale(330),
  },
  headerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingVertical: verticalScale(4),
    paddingHorizontal: verticalScale(16),
    marginTop: verticalScale(40),
    // backgroundColor: "red",
  },
  headerGreetText: {
    fontFamily: "GilroyBold",
    color: "#FFFFFF",
    fontSize: normalizeFont(24),
  },
  headerText: {
    fontFamily: "Gilroy-Bold",
    color: "#FFFFFF",
    fontSize: normalizeFont(38),
    textTransform: "uppercase",
  },
  fab: {
    position: "absolute",
    bottom: verticalScale(100),
    right: scale(20),
    backgroundColor: "#FFFFFF",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderRadius: scale(25),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    zIndex: 99,
  },
  fabText: {
    color: "#000000",
    fontSize: normalizeFont(12),
    fontFamily: "Gilroy-Bold",
  },
  recentTrxContainer: {
    // backgroundColor: "red",
    marginTop: verticalScale(10),
    marginHorizontal: scale(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentTrxText: {
    fontFamily: "GilroyMedium",
    fontSize: normalizeFont(22),
    color: "#FFFFFF",
  },
  viewAllTrxBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: verticalScale(3),
  },
  recentTrxViewAllText: {
    fontFamily: "GilroyMedium",
    fontSize: normalizeFont(16),
    color: "#52B3AD",
  },
});
