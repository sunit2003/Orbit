import { normalizeFont, scale, verticalScale } from "@/core/utils/scaling";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function AvatarContainer() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.mainBox}>
        <View style={styles.avatarContainer}></View>
        <View style={styles.profileContainer}>
          <Ionicons name="notifications" size={22} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(5),
    // backgroundColor: "red",
  },
  mainBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatarContainer: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    borderWidth: scale(0.5),
    borderColor: "transparent",
    backgroundColor: "#FFFFFF",
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(19),
    height: scale(38),
    width: scale(38),
    backgroundColor: "transparent",
    // borderWidth: scale(1),
    // borderColor: "#FFFFFF",
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
