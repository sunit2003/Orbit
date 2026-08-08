import { normalizeFont, scale, verticalScale } from "@/core/utils/scaling";
import { useRouter } from "expo-router";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GetStartedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <View style={styles.heroSection}>
        <Image
          source={require("@/assets/images/personIcon.png")}
          style={styles.manImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>Spend Smarter {"\n"}Save More</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginSection}>
        <Text style={styles.haveAccount}>Already Have Account? </Text>
        <TouchableOpacity activeOpacity={0.5}>
          <Text style={styles.loginButton}>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000ff",
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
});
