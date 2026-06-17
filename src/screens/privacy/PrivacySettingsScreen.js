import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { usePrivacyStore } from "../../store/stores";
import { useAuth } from "../../hooks/useAuth";
import {
  updateLocationPrivacy,
  getLocationPrivacy,
  deleteLocationHistory,
} from "../../services/firestoreService";

/**
 * PrivacySettingsScreen (Fitur 4 - Location Privacy Controls)
 *
 * Features:
 * - Toggle master location sharing (default OFF)
 * - Three privacy modes: Exact / Blurred (±500m) / Hidden
 * - Invisible mode (don't appear in Nearby People)
 * - View and delete location history
 * - Explain implications of each mode
 */
export default function PrivacySettingsScreen({ navigation }) {
  const { user } = useAuth();
  const {
    locationPrivacy,
    setLocationPrivacy,
    updatePrivacyMode,
    toggleInvisibleMode,
  } = usePrivacyStore();

  const [loading, setLoading] = useState(false);
  const [locationHistoryCount, setLocationHistoryCount] = useState(0);

  useEffect(() => {
    loadPrivacySettings();
  }, [user]);

  const loadPrivacySettings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const privacy = await getLocationPrivacy(user.uid);
      setLocationPrivacy(privacy);
    } catch (error) {
      console.error("Error loading privacy settings:", error);
      Alert.alert("Error", "Failed to load privacy settings");
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyModeChange = async (mode) => {
    if (!user) return;
    try {
      setLoading(true);
      updatePrivacyMode(mode);
      await updateLocationPrivacy(user.uid, {
        ...locationPrivacy,
        mode,
      });
    } catch (error) {
      console.error("Error updating privacy mode:", error);
      Alert.alert("Error", "Failed to update privacy settings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleInvisibleMode = async () => {
    if (!user) return;
    try {
      setLoading(true);
      toggleInvisibleMode();
      await updateLocationPrivacy(user.uid, {
        ...locationPrivacy,
        invisibleMode: !locationPrivacy.invisibleMode,
      });
    } catch (error) {
      console.error("Error toggling invisible mode:", error);
      Alert.alert("Error", "Failed to update invisible mode");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocationHistory = async () => {
    if (!user) return;
    Alert.alert(
      "Delete Location History",
      "Are you sure you want to permanently delete all your location history?",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteLocationHistory(user.uid);
              setLocationHistoryCount(0);
              Alert.alert("Success", "Location history deleted");
            } catch (error) {
              console.error("Error deleting history:", error);
              Alert.alert("Error", "Failed to delete location history");
            } finally {
              setLoading(false);
            }
          },
          style: "destructive",
        },
      ],
    );
  };

  if (loading && !locationPrivacy) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const currentMode = locationPrivacy?.mode || "hidden";
  const invisibleMode = locationPrivacy?.invisibleMode || false;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown} style={styles.header}>
          <Text style={styles.title}>Location Privacy Controls</Text>
          <Text style={styles.subtitle}>
            Manage how your location is shared with other users
          </Text>
        </Animated.View>

        {/* Privacy Mode Section */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Mode</Text>
          <Text style={styles.sectionDescription}>
            Choose how precisely your location is shared
          </Text>

          {/* Hidden Mode */}
          <TouchableOpacity
            style={[
              styles.modeCard,
              currentMode === "hidden" && styles.modeCardActive,
            ]}
            onPress={() => handlePrivacyModeChange("hidden")}
            disabled={loading}
          >
            <View style={styles.modeHeader}>
              <Text style={styles.modeName}>Hidden</Text>
              {currentMode === "hidden" && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={styles.modeDescription}>
              Your location is never shared. You won't appear in Nearby People
              or on maps.
            </Text>
          </TouchableOpacity>

          {/* Blurred Mode */}
          <TouchableOpacity
            style={[
              styles.modeCard,
              currentMode === "blurred" && styles.modeCardActive,
            ]}
            onPress={() => handlePrivacyModeChange("blurred")}
            disabled={loading}
          >
            <View style={styles.modeHeader}>
              <Text style={styles.modeName}>Blurred (±500m)</Text>
              {currentMode === "blurred" && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={styles.modeDescription}>
              Your location is randomized within 500m radius for privacy.
            </Text>
          </TouchableOpacity>

          {/* Exact Mode */}
          <TouchableOpacity
            style={[
              styles.modeCard,
              currentMode === "exact" && styles.modeCardActive,
            ]}
            onPress={() => handlePrivacyModeChange("exact")}
            disabled={loading}
          >
            <View style={styles.modeHeader}>
              <Text style={styles.modeName}>Exact</Text>
              {currentMode === "exact" && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={styles.modeDescription}>
              Your precise location is shared. Use only with people you trust.
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Invisible Mode Toggle */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <View style={styles.toggleHeader}>
            <View style={styles.toggleLabel}>
              <Text style={styles.sectionTitle}>Invisible Mode</Text>
              <Text style={styles.sectionDescription}>
                Don't appear in other users' "Nearby People" list
              </Text>
            </View>
            <Switch
              value={invisibleMode}
              onValueChange={handleToggleInvisibleMode}
              disabled={loading}
              trackColor={{ false: "#ccc", true: "#81c784" }}
            />
          </View>
        </Animated.View>

        {/* Location History */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Location History</Text>
          <Text style={styles.sectionDescription}>
            Your location data is stored locally and automatically deleted after
            30 days.
          </Text>
          <View style={styles.historyInfo}>
            <Text style={styles.historyText}>
              Stored entries: {locationHistoryCount}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteLocationHistory}
              disabled={loading}
            >
              <Text style={styles.deleteButtonText}>Delete All History</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Privacy Information */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>About Location Privacy</Text>
          <Text style={styles.infoText}>
            • GeoConnect respects your privacy by default. All location data
            stays on your device until you explicitly share it.{"\n\n"}• Blurred
            location mode uses GeoHash precision level 9 for optimal
            privacy-utility balance.{"\n\n"}• Location history is stored locally
            (Firestore) and auto-purged after 30 days. You can manually delete
            it anytime.{"\n\n"}• Firestore security rules ensure only you and
            authorized recipients can access your location data.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    marginBottom: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    color: "#999",
    marginBottom: 12,
  },
  modeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  modeCardActive: {
    borderColor: "#81c784",
    backgroundColor: "#f1f8f6",
  },
  modeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  checkmark: {
    fontSize: 18,
    color: "#81c784",
    fontWeight: "700",
  },
  modeDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  toggleHeader: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleLabel: {
    flex: 1,
    marginRight: 12,
  },
  historyInfo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  historyText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  infoText: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#81c784",
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
});
