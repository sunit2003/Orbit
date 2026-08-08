import { normalizeFont, scale, verticalScale } from "@/core/utils/scaling";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { GlassView } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { formatToINR } from "../utils/formatValue";
export default function BalanceCard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.mainCard}>
        <View style={styles.topRightBlush}>
          <Svg height="100%" width="100%">
            <Defs>
              <RadialGradient
                id="redBlush"
                cx="100%"
                cy="0%"
                rx="100%"
                ry="100%"
              >
                <Stop offset="0%" stopColor="#b71616ff" stopOpacity="0.25" />
                <Stop offset="100%" stopColor="#CD5C5C" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#redBlush)" />
          </Svg>
        </View>
        <View style={styles.bottomLeftBlush}>
          <Svg height="100%" width="100%">
            <Defs>
              <RadialGradient
                id="greenBlush"
                cx="0%"
                cy="100%"
                rx="80%"
                ry="80%"
              >
                <Stop offset="0%" stopColor="#00a86a" stopOpacity="0.25" />
                <Stop offset="100%" stopColor="#00a86a" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#greenBlush)" />
          </Svg>
        </View>
        <GlassView style={StyleSheet.absoluteFill} />
        <View style={styles.cardTopRow}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Total Balance</Text>
            <Ionicons name="chevron-up" size={scale(17)} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.valueSection}>
          <View style={styles.maskRowMain}>
            <Text style={styles.mainValue}>{"₹"}</Text>
            <Text style={styles.mainValue}>{formatToINR("10342.67")}</Text>
          </View>
        </View>
        <View style={styles.cardRow}>
          <View style={styles.lowerBlock}>
            <View style={styles.lowerBlockHeader}>
              <Text style={styles.incomeTitle}>Income</Text>
              <Ionicons
                name="arrow-up-circle-outline"
                size={scale(17)}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.lowerValueBlock}>
              <Text style={styles.lowerValue}>{"₹"}</Text>
              <Text style={styles.lowerValue}>{formatToINR("10342.67")}</Text>
            </View>
          </View>
          <View style={styles.lowerBlock}>
            <View style={styles.lowerBlockHeader}>
              <Text style={styles.expenseTitle}>Expenses</Text>
              <Ionicons
                name="arrow-down-circle-outline"
                size={scale(16)}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.lowerValueBlock}>
              <Text style={styles.lowerValue}>{"₹"}</Text>
              <Text style={styles.lowerValue}>{formatToINR("10342.67")}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(5),
  },
  mainCard: {
    height: scale(190),
    backgroundColor: "rgba(25, 25, 25, 1)",
    borderRadius: scale(14),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(25),
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: scale(7),
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  topRightBlush: {
    position: "absolute",
    top: 0,
    right: 0,
    width: scale(140),
    height: scale(140),
  },
  bottomLeftBlush: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: scale(140),
    height: scale(140),
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
    // backgroundColor: "red",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
  },
  cardTitle: {
    fontSize: normalizeFont(16),
    color: "#FFFFFF",
    fontFamily: "GilroySemiBold",
  },
  valueSection: {
    marginBottom: verticalScale(14),
    // backgroundColor: "red",
  },
  mainValue: {
    fontSize: normalizeFont(36),
    color: "#FFFFFF",
    fontFamily: "GilroyBold",
    lineHeight: normalizeFont(40),
    marginBottom: verticalScale(6),
  },
  maskRowMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    height: verticalScale(40),
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  lowerBlock: {
    flexDirection: "column",
  },
  lowerBlockHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
    marginBottom: verticalScale(8),
  },
  lowerValueBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    // backgroundColor: "red",
  },
  incomeTitle: {
    fontSize: normalizeFont(14),
    color: "#00A86B",
    fontFamily: "GilroySemiBold",
  },
  expenseTitle: {
    fontSize: normalizeFont(14),
    color: "#CD5C5C",
    fontFamily: "GilroySemiBold",
  },
  lowerValue: {
    fontSize: normalizeFont(20),
    color: "#FFFFFF",
    fontFamily: "GilroySemiBold",
    // lineHeight: normalizeFont(35),
    marginBottom: verticalScale(6),
  },
});
