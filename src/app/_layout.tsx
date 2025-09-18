import "../global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useAuth } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import React from "react";

function AppNavigator() {
  const { isLoaded, isSignedIn } = useAuth();

  const [fontsLoaded] = useFonts({
    "Lexend-Regular": require("../assets/fonts/Lexend-Regular.ttf"),
    "Lexend-Semibold": require("../assets/fonts/Lexend-SemiBold.ttf"),
    "Lexend-Bold": require("../assets/fonts/Lexend-Bold.ttf"),
    "Lexend-Black": require("../assets/fonts/Lexend-Black.ttf"),
  });

  if (!isLoaded || !fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function Layout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <AppNavigator />
    </ClerkProvider>
  );
}
