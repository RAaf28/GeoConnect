import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

const MapMarker = ({ coordinate, type = 'venue', label, onPress, isNew = false }) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (isNew) {
      scale.value = withRepeat(
        withSequence(
          withSpring(1.3, { damping: 4 }),
          withSpring(1.0, { damping: 6 })
        ),
        3,
        false
      );
    }
  }, [isNew]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const markerConfig = {
    venue: { bg: '#4648d4', icon: '📍', label: label || 'Venue' },
    event: { bg: '#904900', icon: '🎉', label: label || 'Event' },
    post:  { bg: '#565e74', icon: '📸', label: label || 'Post' },
    user:  { bg: '#1b1b23', icon: '👤', label: label || 'User' },
  };

  const config = markerConfig[type] || markerConfig.venue;

  return (
    <Marker coordinate={coordinate} onPress={onPress} tracksViewChanges={false}>
      <Animated.View style={animatedStyle}>
        <View style={[styles.markerContainer, { backgroundColor: config.bg }]}>
          <Text style={styles.markerIcon}>{config.icon}</Text>
          {label ? <Text style={styles.markerLabel} numberOfLines={1}>{label}</Text> : null}
        </View>
        <View style={[styles.markerTail, { borderTopColor: config.bg }]} />
      </Animated.View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    maxWidth: 140,
  },
  markerIcon: { fontSize: 14 },
  markerLabel: { color: '#ffffff', fontSize: 12, fontWeight: '600', flexShrink: 1 },
  markerTail: {
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});

export default MapMarker;