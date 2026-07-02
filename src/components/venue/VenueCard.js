import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useThemeStore } from '../../store/stores';

const VenueCard = ({ venue, onPress, index = 0 }) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? darkTheme : lightTheme;

  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    const delay = index * 80;
    const timer = setTimeout(() => {
      translateY.value = withSpring(0, { damping: 14, stiffness: 120 });
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);
    return () => clearTimeout(timer);
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const renderStars = (rating) => {
    if (!rating) return null;
    const full = Math.floor(rating);
    const stars = '★'.repeat(full) + '☆'.repeat(5 - full);
    return (
      <Text style={styles.stars}>
        <Text style={{ color: '#f59e0b' }}>{stars.slice(0, full)}</Text>
        <Text style={{ color: '#c7c4d7' }}>{stars.slice(full)}</Text>
      </Text>
    );
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.cardBg }]}
        onPress={() => onPress?.(venue)}
        activeOpacity={0.85}
      >
        {/* Foto Venue */}
        <View style={styles.imageContainer}>
          {venue?.photoUrl ? (
            <Image source={{ uri: venue.photoUrl }} style={styles.image} />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: theme.placeholder }]}>
              <Text style={styles.placeholderIcon}>🏢</Text>
            </View>
          )}
          {venue?.checkinCount > 0 && (
            <View style={styles.checkinBadge}>
              <Text style={styles.checkinText}>📍 {venue.checkinCount}</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {venue?.name || 'Venue'}
          </Text>
          <View style={styles.row}>
            {venue?.category && (
              <View style={[styles.categoryBadge, { backgroundColor: theme.badgeBg }]}>
                <Text style={[styles.categoryText, { color: theme.badgeText }]}>
                  {venue.category}
                </Text>
              </View>
            )}
            {venue?.distance && (
              <Text style={[styles.distance, { color: theme.muted }]}>
                📍 {venue.distance}
              </Text>
            )}
          </View>
          {venue?.rating ? (
            <View style={styles.ratingRow}>
              {renderStars(venue.rating)}
              <Text style={[styles.ratingText, { color: theme.muted }]}>
                {venue.rating.toFixed(1)}
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.arrow, { color: theme.muted }]}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const lightTheme = {
  cardBg: '#ffffff',
  text: '#1b1b23',
  muted: '#64748B',
  placeholder: '#efecf8',
  badgeBg: '#e1e0ff',
  badgeText: '#4648d4',
};

const darkTheme = {
  cardBg: '#1e1e2a',
  text: '#f2effb',
  muted: '#9ca3af',
  placeholder: '#2a2a38',
  badgeBg: '#2f2ebe',
  badgeText: '#c0c1ff',
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    gap: 12,
  },
  imageContainer: { position: 'relative' },
  image: { width: 64, height: 64, borderRadius: 12 },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: { fontSize: 28 },
  checkinBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#4648d4',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  checkinText: { color: '#ffffff', fontSize: 10, fontWeight: '700' },
  info: { flex: 1, gap: 4 },
  name: { fontSize: 15, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  categoryText: { fontSize: 11, fontWeight: '600' },
  distance: { fontSize: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stars: { fontSize: 12 },
  ratingText: { fontSize: 12 },
  arrow: { fontSize: 22, fontWeight: '300' },
});

export default VenueCard;