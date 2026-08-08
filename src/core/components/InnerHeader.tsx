import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useNavigation, useRoute } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { normalizeFont, scale, verticalScale } from "../utils/scaling";

interface InnerHeaderProps {
  label: string;
  hideBackButton?: boolean;
  onBackPress?: () => void;
}

export const InnerHeader: React.FC<InnerHeaderProps> = ({
  label,
  hideBackButton,
  onBackPress,
}) => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const backRoute = route?.params?.backRoute;

  return (
    <View style={styles.header}>
      {hideBackButton ? (
        <View style={styles.placeholder} />
      ) : (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (onBackPress) {
              onBackPress();
            } else if (backRoute) {
              navigation.navigate(backRoute);
            } else {
              navigation.goBack();
            }
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={scale(20)} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      <Text
        style={styles.headerTitle}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: verticalScale(55),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    backgroundColor: "#1B1B1B",
    borderBottomWidth: scale(1),
    borderColor: "#343434",
  },
  backButton: {
    width: scale(50),
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    flex: 1,
    // textAlign: "center",
    fontSize: normalizeFont(16),
    fontFamily: "GilroySemiBold",
    color: "#FFFFFF",
  },
  rightAction: {
    // width: scale(40),
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  placeholder: {
    width: scale(48),
  },
});
