import React from "react";
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import { useAuth } from "./src/hooks/useAuth";
import { useThemeStore } from "./src/store/stores";

// Screen imports
import FeedScreen from "./src/screens/Feed/Feed";
import ExploreMapScreen from "./src/screens/ExploreMap/ExploreMap";
import ProfileScreen from "./src/screens/Profile/Profile";
import NotificationsScreen from "./src/screens/Notifications/Notifications";
import SettingsScreen from "./src/screens/Settings/Settings";
// SettingsUpdated removed — was a non-functional duplicate of Settings
import PrivacySettingsScreen from "./src/screens/PrivacySettings/PrivacySettings";
import PlacesCheckinScreen from "./src/screens/PlacesCheckin/PlacesCheckin";
import NearbyEventsScreen from "./src/screens/NearbyEvents/NearbyEvents";
import ExploreMapEventsScreen from "./src/screens/ExploreMapEvents/ExploreMapEvents";
import CreatePostScreen from "./src/screens/CreatePost/CreatePost";
import CreateEventScreen from "./src/screens/CreateEvent/CreateEvent";
import EventDetailScreen from "./src/screens/EventDetail/EventDetail";
import PostDetailScreen from "./src/screens/PostDetail/PostDetail";
import StoryViewerScreen from "./src/screens/StoryViewer/StoryViewer";
import LoginScreen from "./src/screens/Login/Login";
import RegisterScreen from "./src/screens/Register/Register";
import ForgotPasswordScreen from "./src/screens/ForgotPassword/ForgotPassword";
import EditProfileScreen from "./src/screens/EditProfile/EditProfile";
import PersonalInformationScreen from "./src/screens/PersonalInformation/PersonalInformation";
import LoginSecurityScreen from "./src/screens/LoginSecurity/LoginSecurity";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

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
      backgroundColor: "#4648d4",
      borderWidth: 4,
      borderColor: "#fcf8ff",
      shadowColor: "#4648d4",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
      justifyContent: "center",
      alignItems: "center",
    }}>
      <MaterialIcons name="add" size={32} color="#ffffff" />
    </View>
    <Text style={{ fontSize: 11, fontWeight: "600", color: "#4648d4", marginTop: 4 }}>Post</Text>
  </TouchableOpacity>
);

// Tab icons using Material Design icons (Android-style)
const TAB_ICONS = {
  Feed: { active: "dynamic-feed", inactive: "dynamic-feed" },
  Explore: { active: "explore", inactive: "explore" },
  Alerts: { active: "notifications", inactive: "notifications-none" },
  Profile: { active: "person", inactive: "person-outline" },
};

const TabIcon = ({ routeName, focused, color }) => {
  const icons = TAB_ICONS[routeName];
  if (!icons) return null;

  const iconName = focused ? icons.active : icons.inactive;
  return <MaterialIcons name={iconName} size={24} color={color} />;
};

// App Tab Navigator
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color }) => (
        <TabIcon routeName={route.name} focused={focused} color={color} />
      ),
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
    <Stack.Screen
      name="CreateEvent"
      component={CreateEventScreen}
      options={{ presentation: "modal", animation: "slide_from_bottom" }}
    />
    <Stack.Screen
      name="EventDetail"
      component={EventDetailScreen}
      options={{ animation: "slide_from_right" }}
    />
    <Stack.Screen
      name="PostDetail"
      component={PostDetailScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="StoryViewer"
      component={StoryViewerScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={({ navigation }) => ({
        animation: "slide_from_right",
        headerShown: true,
        headerTitle: 'Profile',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={{ padding: 16 }}
          >
            <Text style={{ color: '#4648d4', fontWeight: '600', fontSize: 16 }}>
              Edit
            </Text>
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="PersonalInformation"
      component={PersonalInformationScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="LoginSecurity"
      component={LoginSecurityScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{ animation: "slide_from_right", headerShown: false }}
    />
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
          <ActivityIndicator size="large" color="#4648d4" />
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
    backgroundColor: "#fcf8ff",
  },
});
