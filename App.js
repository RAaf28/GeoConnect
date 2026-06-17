import React from "react";
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuth } from "./src/hooks/useAuth";
import { useThemeStore } from "./src/store/stores";

// Screen imports
import FeedScreen from "./src/screens/Feed/Feed";
import ExploreMapScreen from "./src/screens/ExploreMap/ExploreMap";
import ProfileScreen from "./src/screens/Profile/Profile";
import NotificationsScreen from "./src/screens/Notifications/Notifications";
import SettingsScreen from "./src/screens/Settings/Settings";
import SettingsUpdatedScreen from "./src/screens/SettingsUpdated/SettingsUpdated";
import PrivacySettingsScreen from "./src/screens/PrivacySettings/PrivacySettings";
import PlacesCheckinScreen from "./src/screens/PlacesCheckin/PlacesCheckin";
import NearbyEventsScreen from "./src/screens/NearbyEvents/NearbyEvents";
import ExploreMapEventsScreen from "./src/screens/ExploreMapEvents/ExploreMapEvents";
import CreatePostScreen from "./src/screens/CreatePost/CreatePost";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom Tab Bar Button for Create Post
const CustomTabBarButton = ({ navigation }) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: "center",
      alignItems: "center",
    }}
    onPress={() => navigation.navigate("CreatePost")}
    activeOpacity={0.8}
  >
    <View style={{
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#4648d4", // Primary color
      borderWidth: 4,
      borderColor: "#fcf8ff", // Background color
      shadowColor: "#4648d4",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    }}>
      <Text style={{ fontSize: 32, color: "white", textAlign: "center", lineHeight: 52 }}>+</Text>
    </View>
    <Text style={{ fontSize: 11, fontWeight: "600", color: "#4648d4", marginTop: 4 }}>Post</Text>
  </TouchableOpacity>
);

// Tab icon component using Unicode/Emoji as simple icons
const TabIcon = ({ label, focused }) => {
  const icons = {
    Feed: "📰",
    Explore: "🗺️",
    Alerts: "🔔",
    Profile: "👤",
  };
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
      {icons[label] || "•"}
    </Text>
  );
};

// App Tab Navigator
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
      tabBarActiveTintColor: "#4648d4",
      tabBarInactiveTintColor: "#64748B",
      tabBarStyle: {
        backgroundColor: "#fcf8ff",
        borderTopColor: "rgba(226, 232, 240, 0.8)",
        height: 65,
        paddingBottom: 8,
        paddingTop: 4,
      },
      tabBarLabelStyle: {
        fontFamily: "System",
        fontSize: 11,
        fontWeight: "600",
      },
    })}
  >
    <Tab.Screen name="Feed" component={FeedScreen} />
    <Tab.Screen name="Explore" component={ExploreMapScreen} />
    <Tab.Screen 
      name="Post" 
      component={View} // Dummy component, since we intercept the press
      options={({ navigation }) => ({
        tabBarIcon: () => null,
        tabBarLabel: () => null,
        tabBarButton: (props) => (
          <CustomTabBarButton {...props} navigation={navigation} />
        )
      })}
    />
    <Tab.Screen name="Alerts" component={NotificationsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// App Stack
const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainApp" component={AppTabs} />
    <Stack.Screen
      name="CreatePost"
      component={CreatePostScreen}
      options={{ presentation: "modal", animation: "slide_from_bottom" }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ animation: "slide_from_right" }}
    />
    <Stack.Screen
      name="SettingsUpdated"
      component={SettingsUpdatedScreen}
      options={{ animation: "slide_from_right" }}
    />
    <Stack.Screen
      name="PrivacySettings"
      component={PrivacySettingsScreen}
      options={{ animation: "slide_from_right" }}
    />
    <Stack.Screen
      name="PlacesCheckin"
      component={PlacesCheckinScreen}
      options={{ animation: "slide_from_right" }}
    />
    <Stack.Screen
      name="NearbyEvents"
      component={NearbyEventsScreen}
      options={{ animation: "slide_from_right" }}
    />
    <Stack.Screen
      name="ExploreMapEvents"
      component={ExploreMapEventsScreen}
      options={{ animation: "slide_from_right" }}
    />
  </Stack.Navigator>
);

// Root Navigator
export default function App() {
  const { loading } = useAuth(); // Auth flow is now bypassed (Login screen deleted)
  const isDark = useThemeStore((state) => state.isDark);

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4648d4" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppStack />
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
    backgroundColor: "#fcf8ff",
  },
});
