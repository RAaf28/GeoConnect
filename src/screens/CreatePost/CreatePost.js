import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore, useLocationStore } from '../../store/stores';
import { createPost, createEvent } from '../../services/firestoreService';
import { uploadPostImage } from '../../services/storageService';
import { encodeGeoHash } from '../../utils/geoUtils';
import { getNearbyPlaces } from '../../services/placesAPI';
import { Timestamp } from "firebase/firestore";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PLACE_CATEGORIES = ['Cafe', 'Park', 'Mall', 'Culture'];
const EVENT_CATEGORIES = ['Arts & Culture', 'Nature Exploration', 'Local Meetup', 'Fitness Trails'];
const DURATION_OPTIONS = [
  { label: '1 Jam', hours: 1 },
  { label: '2 Jam', hours: 2 },
  { label: '3 Jam', hours: 3 },
  { label: '4 Jam', hours: 4 },
  { label: 'Seharian', hours: 12 },
];

// Helper: format time from Date object to display
const formatTimeRangeDate = (dateObj, durationHours) => {
  if (!dateObj) return '';
  const startH = dateObj.getHours();
  const startM = dateObj.getMinutes();
  const endH = (startH + durationHours) % 24;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(startH)}:${pad(startM)} - ${pad(endH)}:${pad(startM)}`;
};

export default function CreatePost({ navigation }) {
  const { user } = useAuth();
  const isDark = useThemeStore((state) => state.isDark);
  const { currentLocation } = useLocationStore();

  // Form state
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [caption, setCaption] = useState('');
  const [posting, setPosting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Toggle between post and event creation
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Event-specific state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(12, 0, 0, 0);
    return d;
  };

  const [eventDate, setEventDate] = useState(getTomorrow()); 
  const [eventTime, setEventTime] = useState(getTomorrow()); 
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [eventDuration, setEventDuration] = useState(2); // hours
  const [eventCategory, setEventCategory] = useState('Arts & Culture');
  const [eventLat, setEventLat] = useState(null);
  const [eventLng, setEventLng] = useState(null);
  const [eventGeoHash, setEventGeoHash] = useState('');

  // Location tagging state (shared between posts and events)
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPlacePicker, setShowPlacePicker] = useState(false);
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Cafe');
  const [placeSearchQuery, setPlaceSearchQuery] = useState('');

  // Pick image from gallery
  const handlePickImage = useCallback(async () => {
    try {
      const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permResult.granted) {
        Alert.alert('Permission Needed', 'Please grant photo library access to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('[CreatePost] Image picker error:', error);
      Alert.alert('Error', 'Failed to open image picker.');
    }
  }, []);

  // Load nearby places for the picker
  const loadPlaces = useCallback(async (category, query = '') => {
    if (!currentLocation) {
      Alert.alert('Location Unavailable', 'Unable to determine your location for place tagging.');
      return;
    }

    setPlacesLoading(true);
    try {
      const results = await getNearbyPlaces(
        currentLocation.latitude,
        currentLocation.longitude,
        category,
        query
      );
      setPlaces(results);
    } catch (error) {
      console.error('[CreatePost] Error loading places:', error);
      setPlaces([]);
    } finally {
      setPlacesLoading(false);
    }
  }, [currentLocation]);

  // Dynamically load places based on search query, category, or picker visibility
  useEffect(() => {
    if (!currentLocation || !showPlacePicker) return;

    const delayDebounce = setTimeout(() => {
      loadPlaces(selectedCategory, placeSearchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [placeSearchQuery, selectedCategory, currentLocation, showPlacePicker, loadPlaces]);

  // Open place picker
  const handleOpenPlacePicker = useCallback(() => {
    setShowPlacePicker(true);
  }, []);

  // Select a place
  const handleSelectPlace = useCallback((place) => {
    setSelectedPlace(place);
    setShowPlacePicker(false);
  }, []);

  // Change category in place picker
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  // Remove selected place
  const handleRemovePlace = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  // Submit post/event
  const handleSubmit = useCallback(async () => {
    // Validation
    if (!selectedImageUri) {
      Alert.alert('Missing Photo', 'Please add a photo for your post or event.');
      return;
    }

    if (!user) {
      Alert.alert('Login Required', 'Please log in to create a post or event.');
      return;
    }

    // Additional validation for event mode
    if (isCreatingEvent) {
      if (!eventTitle.trim() || !eventDescription.trim()) {
        Alert.alert('Missing Information', 'Please add a title and description for your event.');
        return;
      }
      if (!eventDate || !eventTime) {
        Alert.alert('Missing Information', 'Please set the date and time for your event.');
        return;
      }
    } else {
      // Post mode validation
      if (!caption.trim()) {
        Alert.alert('Missing Caption', 'Please write a caption for your post.');
        return;
      }
    }

    setPosting(true);
    setUploadProgress(0);

    try {
      // Upload image if selected
      let imageURL = '';
      if (selectedImageUri) {
        imageURL = await uploadPostImage(user.uid, selectedImageUri, (progress) => {
          setUploadProgress(progress);
        });
      }

      // Determine location — prefer tagged place, fallback to current location
      let lat = null;
      let lng = null;
      let locationLabel = '';

      if (selectedPlace) {
        lat = selectedPlace.latitude;
        lng = selectedPlace.longitude;
        locationLabel = selectedPlace.name;
      } else if (currentLocation) {
        lat = currentLocation.latitude;
        lng = currentLocation.longitude;
        locationLabel = 'Current Location';
      }

      const geoHash = (lat && lng) ? encodeGeoHash(lat, lng) : null;

      if (isCreatingEvent) {
        // Create event
        // Combine date and time from picker objects
        const startDate = new Date(eventDate);
        startDate.setHours(eventTime.getHours(), eventTime.getMinutes(), 0, 0);

        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + eventDuration);

        await createEvent(user.uid, {
          title: eventTitle.trim(),
          description: eventDescription.trim(),
          imageURL,
          category: eventCategory,
          startDate: Timestamp.fromDate(startDate),
          endDate: Timestamp.fromDate(endDate),
          durationHours: eventDuration,
          geoHash,
          lat,
          lng,
          locationLabel: locationLabel,
        });

        Alert.alert('Success', 'Your event has been created! 🎉', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        // Create post
        await createPost(user.uid, {
          caption: caption.trim(),
          imageURL,
          geoHash,
          lat,
          lng,
          locationLabel,
        });

        Alert.alert('Success', 'Your post has been shared! 🎉', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('[CreatePost] Error creating post/event:', error);
      if (error.message === 'Post creation timeout' || error.message === 'Event creation timeout') {
        Alert.alert('Timeout', 'Creation took too long. Please check your connection and try again.');
      } else {
        Alert.alert('Error', 'Failed to create. Please try again.');
      }
    } finally {
      setPosting(false);
      setUploadProgress(0);
    }
  }, [selectedImageUri, caption, user, selectedPlace, currentLocation, navigation, isCreatingEvent, eventTitle, eventDescription, eventDate, eventTime, eventDuration, eventCategory]);

  // Filter places by search query
  const filteredPlaces = placeSearchQuery.trim()
    ? places.filter(p =>
        p.name.toLowerCase().includes(placeSearchQuery.toLowerCase()) ||
        (p.address || '').toLowerCase().includes(placeSearchQuery.toLowerCase())
      )
    : places;

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={[styles.header, isDark && styles.headerDark]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerButtonIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isCreatingEvent ? 'New Event' : 'New Post'}
        </Text>
        <TouchableOpacity
          style={[styles.postButton,
            (isCreatingEvent ?
              (!eventTitle.trim() || !eventDescription.trim() || !selectedImageUri) :
              (!selectedImageUri && !caption.trim())
            ) && styles.postButtonDisabled]}
          onPress={handleSubmit}
          disabled={posting ||
            (isCreatingEvent ?
              (!eventTitle.trim() || !eventDescription.trim() || !selectedImageUri) :
              (!selectedImageUri && !caption.trim())
            )}
        >
          {posting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>
              {isCreatingEvent ? 'Create' : 'Post'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Image Upload Area */}
          <TouchableOpacity
            style={[styles.imageArea, isDark && styles.imageAreaDark]}
            onPress={handlePickImage}
            activeOpacity={0.7}
          >
            {selectedImageUri ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: selectedImageUri }}
                  style={styles.imagePreview}
                  contentFit="cover"
                  transition={300}
                />
                {/* Edit overlay button */}
                <TouchableOpacity
                  style={styles.editImageButton}
                  onPress={handlePickImage}
                >
                  <Ionicons name="pencil" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons
                  name="camera-outline"
                  size={40}
                  color={isDark ? 'rgba(255,255,255,0.4)' : '#64748B'}
                  style={{ marginBottom: 4 }}
                />
                <Text style={[styles.imagePlaceholderTitle, isDark && styles.textMuted]}>
                  Tap to add a photo
                </Text>
                <Text style={[styles.imagePlaceholderSubtitle, isDark && styles.textDimmed]}>
                  Share your discovery with the world
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Post / Event Toggle */}
          <View style={[styles.toggleContainer, isDark && styles.cardDark]}>
            <TouchableOpacity
              style={[styles.toggleButton, !isCreatingEvent && styles.toggleButtonActive]}
              onPress={() => setIsCreatingEvent(false)}
              activeOpacity={0.7}
            >
              <View style={styles.toggleButtonContent}>
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color={!isCreatingEvent ? '#ffffff' : (isDark ? 'rgba(255,255,255,0.5)' : '#64748B')}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.toggleButtonText, !isCreatingEvent && styles.toggleButtonTextActive]}>
                  Post
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, isCreatingEvent && styles.toggleButtonActive]}
              onPress={() => setIsCreatingEvent(true)}
              activeOpacity={0.7}
            >
              <View style={styles.toggleButtonContent}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={isCreatingEvent ? '#ffffff' : (isDark ? 'rgba(255,255,255,0.5)' : '#64748B')}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.toggleButtonText, isCreatingEvent && styles.toggleButtonTextActive]}>
                  Event
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Conditional Form: Post or Event */}
          {isCreatingEvent ? (
            <>
              {/* Event Title */}
              <View style={[styles.eventFieldContainer, isDark && styles.cardDark]}>
                <Text style={[styles.eventFieldLabel, isDark && styles.textDimmed]}>EVENT TITLE</Text>
                <TextInput
                  style={[styles.eventFieldInput, isDark && styles.textWhite]}
                  placeholder="Nama event kamu ✨"
                  placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#64748B'}
                  maxLength={100}
                  value={eventTitle}
                  onChangeText={setEventTitle}
                />
              </View>

              {/* Event Description */}
              <View style={[styles.eventFieldContainer, isDark && styles.cardDark]}>
                <Text style={[styles.eventFieldLabel, isDark && styles.textDimmed]}>DESKRIPSI</Text>
                <TextInput
                  style={[styles.eventFieldInput, styles.eventTextArea, isDark && styles.textWhite]}
                  placeholder="Detail acara, apa yang perlu dibawa..."
                  placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#64748B'}
                  multiline
                  numberOfLines={4}
                  maxLength={1000}
                  value={eventDescription}
                  onChangeText={setEventDescription}
                  textAlignVertical="top"
                />
                <Text style={[styles.charCount, isDark && styles.textDimmed]}>
                  {eventDescription.length}/1000
                </Text>
              </View>

              {/* Date & Time Row */}
              <View style={styles.eventRow}>
                <TouchableOpacity
                  style={[styles.eventFieldContainer, isDark && styles.cardDark, { flex: 1, marginRight: 8 }]}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.fieldLabelRow}>
                    <Ionicons name="calendar-outline" size={12} color={isDark ? 'rgba(255,255,255,0.5)' : '#64748B'} />
                    <Text style={[styles.eventFieldLabel, isDark && styles.textDimmed]}>Tanggal</Text>
                  </View>
                  <Text style={[styles.eventFieldInput, isDark && styles.textWhite]}>
                    {eventDate.toISOString().split('T')[0]}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.eventFieldContainer, isDark && styles.cardDark, { flex: 1, marginLeft: 8 }]}
                  onPress={() => setShowTimePicker(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.fieldLabelRow}>
                    <Ionicons name="time-outline" size={12} color={isDark ? 'rgba(255,255,255,0.5)' : '#64748B'} />
                    <Text style={[styles.eventFieldLabel, isDark && styles.textDimmed]}>Waktu</Text>
                  </View>
                  <Text style={[styles.eventFieldInput, isDark && styles.textWhite]}>
                    {`${String(eventTime.getHours()).padStart(2, '0')}:${String(eventTime.getMinutes()).padStart(2, '0')}`}
                  </Text>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={eventDate}
                  mode="date"
                  display="default"
                  minimumDate={(() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    d.setHours(0,0,0,0);
                    return d;
                  })()}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setEventDate(selectedDate);
                  }}
                />
              )}
              {showTimePicker && (
                <DateTimePicker
                  value={eventTime}
                  mode="time"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowTimePicker(false);
                    if (selectedDate) setEventTime(selectedDate);
                  }}
                />
              )}

              {/* Duration Picker */}
              <View style={[styles.eventFieldContainer, isDark && styles.cardDark]}>
                <View style={styles.fieldLabelRow}>
                  <Ionicons name="hourglass-outline" size={12} color={isDark ? 'rgba(255,255,255,0.5)' : '#64748B'} />
                  <Text style={[styles.eventFieldLabel, isDark && styles.textDimmed]}>Durasi</Text>
                </View>
                {eventTime && formatTimeRangeDate(eventTime, eventDuration) ? (
                  <Text style={[styles.timeRangeDisplay, isDark && styles.textWhite]}>
                    {formatTimeRangeDate(eventTime, eventDuration)}
                  </Text>
                ) : null}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.durationRow}
                >
                  {DURATION_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.hours}
                      style={[
                        styles.durationPill,
                        eventDuration === opt.hours && styles.durationPillActive,
                        isDark && eventDuration !== opt.hours && styles.durationPillDark,
                      ]}
                      onPress={() => setEventDuration(opt.hours)}
                    >
                      <Text style={[
                        styles.durationPillText,
                        eventDuration === opt.hours && styles.durationPillTextActive,
                        isDark && eventDuration !== opt.hours && styles.durationPillTextDark,
                      ]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Category Picker */}
              <View style={[styles.eventFieldContainer, isDark && styles.cardDark]}>
                <View style={styles.fieldLabelRow}>
                  <Ionicons name="pricetag-outline" size={12} color={isDark ? 'rgba(255,255,255,0.5)' : '#64748B'} />
                  <Text style={[styles.eventFieldLabel, isDark && styles.textDimmed]}>Kategori</Text>
                </View>
                <View style={styles.eventCategoryContainer}>
                  {EVENT_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.eventCategoryPill,
                        eventCategory === cat && styles.eventCategoryPillActive,
                        isDark && eventCategory !== cat && styles.eventCategoryPillDark,
                      ]}
                      onPress={() => setEventCategory(cat)}
                    >
                      <Text style={[
                        styles.eventCategoryText,
                        eventCategory === cat && styles.eventCategoryTextActive,
                        isDark && eventCategory !== cat && styles.eventCategoryTextDark,
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : (
            /* Caption Input (Post mode) */
            <View style={[styles.captionContainer, isDark && styles.cardDark]}>
              <TextInput
                style={[styles.captionInput, isDark && styles.textWhite]}
                placeholder="What did you discover? ✨"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#64748B'}
                multiline
                numberOfLines={4}
                maxLength={500}
                value={caption}
                onChangeText={setCaption}
                textAlignVertical="top"
              />
              <Text style={[styles.charCount, isDark && styles.textDimmed]}>
                {caption.length}/500
              </Text>
            </View>
          )}

          {/* Location Tag */}
          <TouchableOpacity
            style={[styles.locationTag, isDark && styles.cardDark]}
            onPress={handleOpenPlacePicker}
            activeOpacity={0.7}
          >
            <View style={styles.locationIconContainer}>
              <Ionicons
                name="location"
                size={22}
                color={isDark ? '#6063ee' : '#4648d4'}
              />
            </View>
            <View style={styles.locationInfo}>
              <Text style={[styles.locationTitle, isDark && styles.textWhite]}>
                {selectedPlace ? selectedPlace.name : 'Add Location'}
              </Text>
              <Text style={[styles.locationSubtitle, isDark && styles.textDimmed]}>
                {selectedPlace
                  ? selectedPlace.address || selectedPlace.category
                  : isCreatingEvent ? 'Tag lokasi event' : 'Tag a nearby place to your post'}
              </Text>
            </View>
            {selectedPlace ? (
              <TouchableOpacity onPress={handleRemovePlace} style={styles.removePlace}>
                <Text style={styles.removePlaceIcon}>✕</Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.chevron, isDark && styles.textDimmed]}>›</Text>
            )}
          </TouchableOpacity>

          {/* Current location fallback notice */}
          {!selectedPlace && currentLocation && (
            <View style={styles.locationNotice}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color={isDark ? 'rgba(255,255,255,0.5)' : '#64748B'}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.locationNoticeText, isDark && styles.textDimmed]}>
                Your current location will be used if no place is tagged
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Posting Overlay */}
      {posting && (
        <View style={styles.postingOverlay}>
          <View style={[styles.postingCard, isDark && styles.postingCardDark]}>
            <ActivityIndicator size="large" color="#4648d4" />
            <Text style={[styles.postingText, isDark && styles.textWhite]}>
              Creating your post...
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
            </View>
            <Text style={[styles.progressText, isDark && styles.textDimmed]}>
              {uploadProgress}%
            </Text>
          </View>
        </View>
      )}

      {/* Place Picker Modal */}
      <Modal
        visible={showPlacePicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPlacePicker(false)}
      >
        <SafeAreaView style={[styles.modalContainer, isDark && styles.containerDark]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, isDark && styles.headerDark]}>
            <TouchableOpacity onPress={() => setShowPlacePicker(false)}>
              <Text style={[styles.modalCancelText, isDark && styles.textMuted]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, isDark && styles.textWhite]}>Tag a Place</Text>
            <View style={{ width: 60 }} />
          </View>

          {/* Search Bar */}
          <View style={[styles.placeSearchContainer, isDark && styles.cardDark]}>
            <Ionicons
              name="search-outline"
              size={16}
              color={isDark ? 'rgba(255,255,255,0.4)' : '#64748B'}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.placeSearchInput, isDark && styles.textWhite]}
              placeholder="Search places..."
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#64748B'}
              value={placeSearchQuery}
              onChangeText={setPlaceSearchQuery}
            />
          </View>

          {/* Category Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryTabs}
          >
            {PLACE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryTab,
                  cat === selectedCategory && styles.categoryTabActive,
                  isDark && cat !== selectedCategory && styles.categoryTabDark,
                ]}
                onPress={() => handleCategoryChange(cat)}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    cat === selectedCategory && styles.categoryTabTextActive,
                    isDark && cat !== selectedCategory && styles.categoryTabTextDark,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Places List */}
          {placesLoading ? (
            <View style={styles.placesLoading}>
              <ActivityIndicator size="large" color="#4648d4" />
              <Text style={[styles.placesLoadingText, isDark && styles.textDimmed]}>
                Finding nearby places...
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredPlaces}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.placesList}
              ListEmptyComponent={() => (
                <View style={styles.placesEmpty}>
                  <Ionicons
                    name="map-outline"
                    size={36}
                    color={isDark ? 'rgba(255,255,255,0.3)' : '#cbd5e1'}
                    style={styles.placesEmptyIcon}
                  />
                  <Text style={[styles.placesEmptyText, isDark && styles.textDimmed]}>
                    No places found nearby
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.placeItem, isDark && styles.placeItemDark]}
                  onPress={() => handleSelectPlace(item)}
                  activeOpacity={0.7}
                >
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.placeImage}
                      contentFit="cover"
                      transition={200}
                    />
                  ) : (
                    <View style={[styles.placeImage, styles.placeImagePlaceholder]}>
                      <Ionicons name="location" size={24} color="#4648d4" />
                    </View>
                  )}
                  <View style={styles.placeInfo}>
                    <Text style={[styles.placeName, isDark && styles.textWhite]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={[styles.placeAddress, isDark && styles.textDimmed]} numberOfLines={1}>
                      {item.address || item.description}
                    </Text>
                    <View style={styles.placeMetaRow}>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={12} color="#fbbf24" style={{ marginRight: 2 }} />
                        <Text style={styles.placeRating}>{item.rating}</Text>
                      </View>
                      {item.distance != null && (
                        <Text style={[styles.placeDistance, isDark && styles.textDimmed]}>
                          {item.distance < 1
                            ? `${Math.round(item.distance * 1000)}m`
                            : `${item.distance.toFixed(1)}km`}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text style={[styles.selectPlaceChevron, isDark && styles.textDimmed]}>›</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Use Current Location Button */}
          {currentLocation && (
            <TouchableOpacity
              style={[styles.useCurrentLocationButton, isDark && styles.useCurrentLocationButtonDark]}
              onPress={() => {
                setSelectedPlace({
                  name: 'Current Location',
                  address: `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`,
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  category: 'Current',
                });
                setShowPlacePicker(false);
              }}
            >
              <Ionicons name="locate-outline" size={18} color="#ffffff" />
              <Text style={styles.useCurrentLocationText}>Use Current Location</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf8ff',
  },
  containerDark: {
    backgroundColor: '#1b1b23',
  },

  // Header
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
    backgroundColor: 'rgba(252, 248, 255, 0.95)',
  },
  headerDark: {
    backgroundColor: 'rgba(27, 27, 35, 0.95)',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonIcon: {
    fontSize: 16,
    color: '#464554',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4648d4',
    letterSpacing: -0.3,
  },
  postButton: {
    backgroundColor: '#4648d4',
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 20,
  },
  postButtonDisabled: {
    opacity: 0.45,
  },
  postButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },

  // Image Area
  imageArea: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#c7c4d7',
    overflow: 'hidden',
    minHeight: 220,
  },
  imageAreaDark: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    minHeight: 300,
  },
  imagePreview: {
    width: '100%',
    height: 350,
    borderRadius: 18,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  imagePlaceholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
  },
  imagePlaceholderSubtitle: {
    fontSize: 13,
    color: '#64748B',
    opacity: 0.7,
  },

  // Caption
  captionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  cardDark: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  captionInput: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1b1b23',
    minHeight: 100,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // Location Tag
  locationTag: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  locationIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(70, 72, 212, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1b1b23',
    marginBottom: 2,
  },
  locationSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  chevron: {
    fontSize: 24,
    color: '#c7c4d7',
    fontWeight: '300',
  },
  removePlace: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePlaceIcon: {
    fontSize: 12,
    color: '#ba1a1a',
    fontWeight: '700',
  },
  locationNotice: {
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationNoticeText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },

  // Posting Overlay
  postingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  postingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    width: SCREEN_WIDTH * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  postingCardDark: {
    backgroundColor: '#303038',
  },
  postingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b1b23',
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#e4e1ed',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4648d4',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#fcf8ff',
  },
  modalHeader: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  modalCancelText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b1b23',
  },

  // Place Search
  placeSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    height: 46,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  searchIcon: {
    marginRight: 10,
  },
  placeSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1b1b23',
  },

  // Category Tabs
  categoryTabs: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e4e1ed',
  },
  categoryTabDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  categoryTabActive: {
    backgroundColor: '#4648d4',
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#464554',
  },
  categoryTabTextDark: {
    color: 'rgba(255,255,255,0.5)',
  },
  categoryTabTextActive: {
    color: '#ffffff',
  },

  // Places List
  placesList: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 10,
    gap: 14,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.3)',
  },
  placeItemDark: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  placeImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  placeImagePlaceholder: {
    backgroundColor: '#e4e1ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1b1b23',
    marginBottom: 2,
  },
  placeAddress: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  placeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  placeRating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4648d4',
  },
  placeDistance: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  selectPlaceChevron: {
    fontSize: 22,
    color: '#c7c4d7',
    fontWeight: '300',
  },

  // Loading & Empty
  placesLoading: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  placesLoadingText: {
    fontSize: 14,
    color: '#64748B',
  },
  placesEmpty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  placesEmptyIcon: {
    marginBottom: 8,
  },
  placesEmptyText: {
    fontSize: 14,
    color: '#64748B',
  },

  // Use Current Location Button
  useCurrentLocationButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4648d4',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  useCurrentLocationButtonDark: {
    backgroundColor: '#6063ee',
  },
  useCurrentLocationText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Post/Event Toggle
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#4648d4',
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  toggleButtonTextActive: {
    color: '#ffffff',
  },

  // Event Form Fields
  eventFieldContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  eventFieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  eventFieldInput: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1b1b23',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
    paddingVertical: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  eventTextArea: {
    minHeight: 80,
    borderBottomWidth: 0,
  },
  eventRow: {
    flexDirection: 'row',
  },

  // Time Range Display
  timeRangeDisplay: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4648d4',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // Duration Picker
  durationRow: {
    gap: 8,
    paddingVertical: 4,
  },
  durationPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#e4e1ed',
  },
  durationPillDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  durationPillActive: {
    backgroundColor: '#4648d4',
  },
  durationPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#464554',
  },
  durationPillTextDark: {
    color: 'rgba(255,255,255,0.5)',
  },
  durationPillTextActive: {
    color: '#ffffff',
  },

  // Event Category
  eventCategoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  eventCategoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#e4e1ed',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  eventCategoryPillDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  eventCategoryPillActive: {
    backgroundColor: 'rgba(70, 72, 212, 0.12)',
    borderColor: '#4648d4',
  },
  eventCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#464554',
  },
  eventCategoryTextDark: {
    color: 'rgba(255,255,255,0.5)',
  },
  eventCategoryTextActive: {
    color: '#4648d4',
    fontWeight: '700',
  },

  // Text helpers
  textWhite: {
    color: '#f2effb',
  },
  textMuted: {
    color: 'rgba(255,255,255,0.6)',
  },
  textDimmed: {
    color: 'rgba(255,255,255,0.35)',
  },
  toggleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
