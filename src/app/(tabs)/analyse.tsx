import BalanceCard from "@/core/components/BalanceCard";
import { normalizeFont, scale, verticalScale } from "@/core/utils/scaling";
import { useRouter } from "expo-router";
import { Image, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalyseScreen() {
  const router = useRouter();

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
          <View style={[styles.cardContainer, styles.firstCardOverlap]}>
            <BalanceCard />
          </View>
        </SafeAreaView>
      </ScrollView>
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
    marginTop: verticalScale(140),
    marginBottom: verticalScale(25),
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(20),
    paddingHorizontal: verticalScale(30),
  },
  manImage: {
    width: scale(400),
    height: scale(420),
    marginVertical: verticalScale(30),
  },
  title: {
    textAlign: "center",
    fontFamily: "Gilroy-Bold",
    color: "#438883",
    fontSize: normalizeFont(40),
    lineHeight: scale(44),
    marginBottom: verticalScale(20),
  },
  button: {
    backgroundColor: "#E5E4E2",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(48),
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginTop: verticalScale(10),
    borderColor: "transparent",
    borderWidth: scale(0.5),
    shadowColor: "#438883ff",
    elevation: 10,
  },
  buttonText: {
    color: "#000000",
    fontSize: normalizeFont(18),
    fontFamily: "Gilroy-Bold",
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
  loginButton: {
    fontSize: normalizeFont(14),
    fontFamily: "Gilroy-Bold",
    color: "#438883",
    textDecorationLine: "underline",
  },
  headerBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: scale(280),
  },
});
