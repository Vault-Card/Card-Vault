import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

import { Authenticator } from '@aws-amplify/ui-react-native';
// Removed unused import as AuthenticatorContextType is not exported
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { CardListContextProvider } from '@/contexts/cardListContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
    <Authenticator.Provider>
      <Authenticator>
        {(({ signOut, user }: { signOut: () => void; user: any }) => (
          <GluestackUIProvider mode="light">
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <CardListContextProvider>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </CardListContextProvider>
            </ThemeProvider>
          </GluestackUIProvider>
        )) as unknown as ReactNode}
      </Authenticator>
    </Authenticator.Provider>
  );
}
