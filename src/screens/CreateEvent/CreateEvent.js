import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

import { useAuth } from "../../hooks/useAuth";
import { createEvent } from "../../services/firestoreService";
import { encodeGeoHash } from "../../utils/geoUtils";

export default function CreateEventScreen({ navigation }) {
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Arts & Culture");
  const [locationName, setLocationName] = useState("Mission Dolores Park, SF");
  const [dateStr, setDateStr] = useState("Friday, July 10");
  const [timeStr, setTimeStr] = useState("6:00 PM");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80");
  
  // Hardcoded for demo, normally we'd pick this from the map
  const [lat, setLat] = useState(37.7596);
  const [lng, setLng] = useState(-122.4269);

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);

  const CATEGORIES = ["Arts & Culture", "Nature Exploration", "Local Meetup", "Fitness Trails"];

  const handleCreateEventSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setPublishError("All fields including Event Title and detailed description are required.");
      return;
    }

    setIsPublishing(true);
    setPublishError(null);

    try {
      if (!user) throw new Error("User not authenticated");

      const eventData = {
        title,
        description,
        imageUrl,
        category,
        dateStr,
        timeStr,
        locationName,
        lat,
        lng,
        geoHash: encodeGeoHash(lat, lng),
        authorName: user.displayName || "Explorer",
        authorAvatar: user.photoURL || "",
      };

      await createEvent(user.uid, eventData);
      
      setIsPublishing(false);
      Alert.alert("Success", "Event created successfully!");
      navigation.navigate("MainApp", { screen: "Explore" }); // Navigate back to Explore map
    } catch (error) {
      console.error("Error creating event:", error);
      setPublishError(error.message || "Failed to publish event.");
      setIsPublishing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Host New Event</Text>
        <TouchableOpacity
          onPress={handleCreateEventSubmit}
          disabled={isPublishing}
          style={[styles.hostButton, isPublishing && styles.hostButtonDisabled]}
        >
          {isPublishing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.hostButtonText}>Host</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Error Banner */}
        {publishError && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#ba1a1a" />
            <View style={styles.errorTextContainer}>
              <Text style={styles.errorText}>{publishError}</Text>
              <TouchableOpacity onPress={() => setPublishError(null)}>
                <Text style={styles.errorDismiss}>DISMISS ERROR</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Golden Gate Botanical Painting Study"
            placeholderTextColor="#c7c4d7"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Detailed Specifications</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Give details about required materials, meeting coordinates..."
            placeholderTextColor="#c7c4d7"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Track Category</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, category === cat && styles.categoryPillActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Target Date</Text>
            <TextInput
              style={styles.input}
              value={dateStr}
              onChangeText={setDateStr}
              placeholder="e.g. Saturday, June 27"
              placeholderTextColor="#c7c4d7"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Meeting Time</Text>
            <TextInput
              style={styles.input}
              value={timeStr}
              onChangeText={setTimeStr}
              placeholder="e.g. 2:00 PM"
              placeholderTextColor="#c7c4d7"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Anchor Region Address</Text>
          <TextInput
            style={styles.input}
            value={locationName}
            onChangeText={setLocationName}
            placeholder="e.g. Lands End Lookout, San Francisco"
            placeholderTextColor="#c7c4d7"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Cover Imagery URL</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, fontFamily: "monospace", fontSize: 11 }]}
              value={imageUrl}
              onChangeText={setImageUrl}
            />
            <TouchableOpacity
              style={styles.randomizeButton}
              onPress={() => {
                const alts = [
                  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop&q=80"
                ];
                setImageUrl(alts[Math.floor(Math.random() * alts.length)]);
              }}
            >
              <Text style={styles.randomizeText}>RANDOMIZE</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mapCard}>
          <Text style={styles.mapTitle}>Geofencing Target Coordinates</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              pitchEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={{ latitude: lat, longitude: lng }} />
            </MapView>
            <View style={styles.mapOverlayLabel}>
              <Text style={styles.mapOverlayText}>
                LAT: {lat} °N / LNG: {Math.abs(lng)} °W
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcf8ff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#efecf8",
    backgroundColor: "rgba(252, 248, 255, 0.9)",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#64748B",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4648d4",
  },
  hostButton: {
    backgroundColor: "#4648d4",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
  hostButtonDisabled: {
    backgroundColor: "#a5a6ea",
  },
  hostButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  errorBanner: {
    flexDirection: "row",
    backgroundColor: "#fff1f1",
    borderColor: "#ffcaca",
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  errorTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  errorText: {
    color: "#ba1a1a",
    fontSize: 12,
    fontWeight: "500",
  },
  errorDismiss: {
    color: "#ba1a1a",
    fontSize: 10,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginTop: 6,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(199, 196, 215, 0.7)",
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#1b1b23",
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryPill: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(199, 196, 215, 0.5)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryPillActive: {
    backgroundColor: "#eff2fb",
    borderColor: "#4648d4",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#464554",
  },
  categoryTextActive: {
    color: "#4648d4",
  },
  row: {
    flexDirection: "row",
  },
  randomizeButton: {
    backgroundColor: "#efecf8",
    borderWidth: 1,
    borderColor: "rgba(199, 196, 215, 0.4)",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  randomizeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1b1b23",
  },
  mapCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(199, 196, 215, 0.45)",
    marginTop: 8,
  },
  mapTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1b1b23",
    marginBottom: 8,
  },
  mapContainer: {
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapOverlayLabel: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -40 }],
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#efecf8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapOverlayText: {
    fontSize: 10,
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#4648d4",
  },
});
