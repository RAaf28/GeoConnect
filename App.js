import React, { useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuth } from "./src/hooks/useAuth";
import { useThemeStore, useAuthStore } from "./src/store/stores";
import PrivacySettingsScreen from "./src/screens/privacy/PrivacySettingsScreen";

// Placeholder screens (to be implemented)
const LoginScreen = ({ navigation }) => (
  <View style={styles.screen}>
    <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>Login Screen</Text>
    <Text style={{ color: "#666", marginBottom: 20 }}>The app successfully loaded!</Text>
    <Button
      title="Mock Sign In (Go to App)"
      onPress={() => useAuthStore.getState().setUser({ uid: "mock-user-123", email: "test@example.com" })}
    />
    <View style={{ marginTop: 10 }}>
      <Button title="Go to Register Screen" onPress={() => navigation.navigate("Register")} />
    </View>
  </View>
);
const RegisterScreen = ({ navigation }) => (
  <View style={styles.screen}>
    <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>Register Screen</Text>
    <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
  </View>
);

const FeedScreen = ({ navigation }) => (
  <View style={styles.screen}>
    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Feed Screen</Text>
    <Button title="Go to Privacy Settings Modal" onPress={() => navigation.navigate("Privacy")} />
    <View style={{ marginTop: 15 }}>
      <Button title="Sign Out" onPress={() => useAuthStore.getState().logout()} />
    </View>
  </View>
);
const ExploreMapScreen = () => (
  <View style={styles.screen}>
    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Explore Map Screen</Text>
  </View>
);
const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Profile Screen</Text>
  </View>
);
const NotificationScreen = () => (
  <View style={styles.screen}>
    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Notification Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// App Tab Navigator
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: true,
    }}
  >
    <Tab.Screen name="Feed" component={FeedScreen} />
    <Tab.Screen name="Explore" component={ExploreMapScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Notifications" component={NotificationScreen} />
  </Tab.Navigator>
);

// App Stack (authenticated)
const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MainApp"
      component={AppTabs}
      options={{ headerShown: false }}
    />
    <Stack.Group screenOptions={{ presentation: "modal" }}>
      <Stack.Screen name="Privacy" component={PrivacySettingsScreen} />
    </Stack.Group>
  </Stack.Navigator>
);

// Root Navigator
export default function App() {
  const { user, loading } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
