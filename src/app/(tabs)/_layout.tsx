import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 8, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Gilroy-SemiBold",
        },

        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#9E9E9E",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
        }}
      />
    </Tabs>
  );
}
