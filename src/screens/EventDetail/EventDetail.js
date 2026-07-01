import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

import { useAuth } from "../../hooks/useAuth";
import { getEvent, updateRSVP, getUserRSVP } from "../../services/firestoreService";

export default function EventDetailScreen({ route, navigation }) {
  const { eventId } = route.params || {};
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const fetchEventData = async () => {
      try {
        const eventData = await getEvent(eventId);
        setEvent(eventData);

        if (user) {
          const status = await getUserRSVP(eventId, user.uid);
          setHasJoined(status === "going");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, user]);

  const handleJoinClick = async () => {
    if (!user || !event) return;

    setIsJoining(true);
    try {
      const newStatus = hasJoined ? "not_going" : "going";
      await updateRSVP(event.id, user.uid, newStatus);
      setHasJoined(!hasJoined);

      if (!hasJoined) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Error updating RSVP:", error);
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4648d4" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#ba1a1a" />
        <Text style={styles.errorTitle}>Event telemetry missing</Text>
        <Text style={styles.errorSub}>Could not resolve the specified geofencing marker on secure servers.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back to Explore Map</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Toast Notification */}
      {showToast && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          exiting={FadeOutUp.duration(300)}
          style={styles.toast}
        >
          <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
          <View style={styles.toastTextContainer}>
            <Text style={styles.toastTitle}>Cataloged Attendees list! {event.title}</Text>
            <Text style={styles.toastSub}>We have secured your slot. Refresh Alerts for final rendezvous coordinate pins.</Text>
          </View>
          <TouchableOpacity onPress={() => setShowToast(false)}>
            <Ionicons name="close" size={16} color="#94a3b8" />
          </TouchableOpacity>
        </Animated.View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: event.imageUrl }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          
          <TouchableOpacity style={styles.heroBackButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#1b1b23" />
          </TouchableOpacity>
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category || "General"}</Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#4648d4" />
            <Text style={styles.locationText}>{event.locationName}</Text>
          </View>

          {/* Host Panel */}
          <View style={styles.hostPanel}>
            <View style={styles.hostInfo}>
              <Image source={{ uri: event.authorAvatar || "https://via.placeholder.com/40" }} style={styles.hostAvatar} />
              <View>
                <Text style={styles.hostLabel}>Event Host / Pioneer</Text>
                <Text style={styles.hostName}>{event.authorName}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewProfileText}>VIEW PROFILE</Text>
            </TouchableOpacity>
          </View>

          {/* Schedule */}
          <View style={styles.scheduleRow}>
            <View style={styles.scheduleBox}>
              <Ionicons name="calendar" size={20} color="#4648d4" />
              <Text style={styles.scheduleLabel}>Rendesvouz Date</Text>
              <Text style={styles.scheduleValue}>{event.dateStr}</Text>
            </View>
            <View style={styles.scheduleBox}>
              <Ionicons name="time" size={20} color="#4648d4" />
              <Text style={styles.scheduleLabel}>Rendesvouz Time</Text>
              <Text style={styles.scheduleValue}>{event.timeStr}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Description</Text>
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>{event.description}</Text>
            </View>
          </View>

          {/* Map Preview */}
          <View style={styles.section}>
            <View style={styles.mapHeaderRow}>
              <Text style={styles.sectionTitle}>Rendesvouz Satellite Mapping</Text>
              <Text style={styles.mapBadge}>GEOFENCE LOCKED</Text>
            </View>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: event.lat || 37.7596,
                  longitude: event.lng || -122.4269,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                pitchEnabled={false}
                rotateEnabled={false}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker coordinate={{ latitude: event.lat || 37.7596, longitude: event.lng || -122.4269 }} />
              </MapView>
            </View>
          </View>

          {/* Join Button */}
          <TouchableOpacity
            style={[styles.joinButton, hasJoined && styles.joinedButton]}
            onPress={handleJoinClick}
            disabled={isJoining}
          >
            {isJoining ? (
              <ActivityIndicator size="small" color={hasJoined ? "#ba1a1a" : "#fff"} />
            ) : hasJoined ? (
              <>
                <Ionicons name="close-circle" size={18} color="#ba1a1a" />
                <Text style={styles.joinedButtonText}>LEAVE EVENT SLOT</Text>
              </>
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={18} color="#fff" />
                <Text style={styles.joinButtonText}>RESERVE EVENT SLOT</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcf8ff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b1b23",
    marginTop: 16,
  },
  errorSub: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#4648d4",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  toast: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 100,
  },
  toastTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  toastTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  toastSub: {
    color: "#94a3b8",
    fontSize: 10,
    marginTop: 2,
  },
  heroContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  heroBackButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "#4f46e5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "monospace",
  },
  detailsSection: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1b1b23",
    lineHeight: 32,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    marginLeft: 6,
  },
  hostPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(199, 196, 215, 0.35)",
    marginTop: 24,
  },
  hostInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  hostLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748B",
    textTransform: "uppercase",
  },
  hostName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1b1b23",
    marginTop: 2,
  },
  viewProfileText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4648d4",
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  scheduleBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  scheduleLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#64748B",
    textTransform: "uppercase",
    marginTop: 4,
  },
  scheduleValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1b1b23",
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  descriptionBox: {
    backgroundColor: "rgba(255,255,255,0.4)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(239, 236, 248, 0.75)",
  },
  descriptionText: {
    fontSize: 12,
    color: "#444",
    lineHeight: 20,
  },
  mapHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  mapBadge: {
    fontSize: 10,
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#4648d4",
  },
  mapContainer: {
    height: 128,
    borderRadius: 16,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4648d4",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 32,
  },
  joinedButton: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  joinButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 8,
  },
  joinedButtonText: {
    color: "#ba1a1a",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
