import { scale } from "@/core/utils/scaling";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Tabs } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";
import { Shadow } from "react-native-shadow-2";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          // width: "95%",
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
          marginBottom: scale(20),
          marginHorizontal: scale(10),
          shadowColor: "rgba(82, 179, 173, 0.45)",
          elevation: scale(10),
        },
        tabBarBackground: () => (
          <View style={{ flex: 1, overflow: "visible" }}>
            {/* <Shadow
              distance={10}
              startColor="rgba(82, 179, 173, 0.45)"
              offset={[0, -2]}
              stretch={true}
              style={{ width: "100%", height: "100%" }}
            > */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#000000",
                borderWidth: 1.5,
                borderColor: "rgba(82, 179, 173, 0.45)",
                borderRadius: scale(40),
              }}
            />
            {/* </Shadow> */}
          </View>
        ),

        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Gilroy-SemiBold",
        },

        tabBarActiveTintColor: "#52B3AD",
        tabBarInactiveTintColor: "#FFFFFF",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "",
          tabBarItemStyle: { transform: [{ translateX: 5 }] },
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/home.png")}
              style={{ width: 24, height: 24, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analyse"
        options={{
          title: "",
          tabBarItemStyle: { transform: [{ translateX: 0 }] },
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/chart.png")}
              style={{ width: 24, height: 24, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          tabBarStyle: { display: "none" },
          tabBarButton: (props) => (
            <View
              style={[
                props.style,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "visible",
                },
              ]}
            >
              <Shadow
                distance={15}
                startColor="rgba(82, 179, 173, 0.4)"
                offset={[0, 0]}
                containerStyle={{ top: -30 }}
                style={{ borderRadius: 28 }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={props.onPress}
                  accessibilityState={props.accessibilityState}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: "#52B3AD",
                    borderWidth: 0.5,
                    borderColor: "transparent",
                  }}
                >
                  <Ionicons name="add" size={30} color="#FFFFFF" />
                </TouchableOpacity>
              </Shadow>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "",
          tabBarItemStyle: { transform: [{ translateX: 0 }] },
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/wallet.png")}
              style={{ width: 28, height: 28, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "",
          tabBarItemStyle: { transform: [{ translateX: -5 }] },
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/user.png")}
              style={{ width: 24, height: 24, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
