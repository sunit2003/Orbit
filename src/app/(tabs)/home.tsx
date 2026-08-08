import AvatarContainer from "@/core/components/AvatarContainer";
import BalanceCard from "@/core/components/BalanceCard";
import { normalizeFont, scale, verticalScale } from "@/core/utils/scaling";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
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
          <AvatarContainer />
          <View style={styles.headerContainer}>
            <Text style={styles.headerGreetText}>Hello,</Text>
            <Text style={styles.headerText}>sunit!</Text>
          </View>
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
});
