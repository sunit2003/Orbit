import { initializeDatabase } from "@/database/database";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Gilroy-Bold": require("../../assets/fonts/Gilroy-Bold.ttf"),
    "Gilroy-Heavy": require("../../assets/fonts/Gilroy-Heavy.ttf"),
    "Gilroy-Light": require("../../assets/fonts/Gilroy-Light.ttf"),
    "Gilroy-Medium": require("../../assets/fonts/Gilroy-Medium.ttf"),
    "Gilroy-Regular": require("../../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy-SemiBold": require("../../assets/fonts/Gilroy-SemiBold.ttf"),
    GilroyBold: require("../../assets/fonts/Gilroy-Bold.ttf"),
    GilroyHeavy: require("../../assets/fonts/Gilroy-Heavy.ttf"),
    GilroyLight: require("../../assets/fonts/Gilroy-Light.ttf"),
    GilroyMedium: require("../../assets/fonts/Gilroy-Medium.ttf"),
    GilroyRegular: require("../../assets/fonts/Gilroy-Regular.ttf"),
    GilroySemiBold: require("../../assets/fonts/Gilroy-SemiBold.ttf"),
  });

  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    try {
      initializeDatabase();
      setDatabaseReady(true);
    } catch (error) {
      console.error("Database initialization failed:", error);
    }
  }, []);

  useEffect(() => {
    if ((loaded || error) && databaseReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, databaseReady]);

  if ((!loaded && !error) || !databaseReady) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
