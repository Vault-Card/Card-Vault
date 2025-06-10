import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { CardListContextProvider } from '@/contexts/cardListContext';
import "@/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Amplify } from "aws-amplify";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import outputs from "../amplify_outputs";

Amplify.configure(outputs);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Authenticator.Provider>
          <Authenticator
                 Container={(props) => (
          // reuse default `Container` and apply custom background
          <>
            <Authenticator.Container
              {...props}
              style={{ backgroundColor: "#5BC0E7",
               }}
            />
          </>
        )}
          >
            <CardListContextProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </CardListContextProvider>
          </Authenticator>
        </Authenticator.Provider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
