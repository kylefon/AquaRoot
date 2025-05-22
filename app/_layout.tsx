import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect } from 'react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { NotificationsProvider } from '@/context/useNotifications';
import migrations from '@/drizzle/migrations';
import { useColorScheme } from '@/hooks/useColorScheme';
import { drizzle } from 'drizzle-orm/expo-sqlite/driver';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider } from '../context/UserContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const DATABASE_NAME = 'user'

export default function RootLayout() {

  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  useEffect(() => {
    if (success) {
      console.log("✅ Drizzle migrations applied successfully.");
    }
    if (error) {
      console.error("❌ Drizzle migration error:", error);
    }
  }, [success, error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Suspense fallback={<ActivityIndicator size={'large'} />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <NotificationsProvider>
          {/* <NotificationHandler /> */}
          <GestureHandlerRootView>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <UserProvider>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="sign-up" options={{ headerShown: false }} />
                  <Stack.Screen name="plant-type" options={{ headerShown: false }} />
                  <Stack.Screen name="my-home" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </UserProvider>
            </ThemeProvider>
          </GestureHandlerRootView>
        </NotificationsProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
