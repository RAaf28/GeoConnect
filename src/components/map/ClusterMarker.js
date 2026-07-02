import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const ClusterMarker = ({ coordinate, count = 0, onPress }) => {
  const size = count > 20 ? 56 : count > 10 ? 48 : 40;
  const bgOpacity = count > 20 ? 1 : count > 10 ? 0.9 : 0.8;

  return (
    <Marker coordinate={coordinate} onPress={onPress} tracksViewChanges={false}>
      <View style={[styles.outerRing, { width: size + 12, height: size + 12, borderRadius: (size + 12) / 2 }]}>
        <View style={[
          styles.inner,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: `rgba(70, 72, 212, ${bgOpacity})`,
          }
        ]}>
          <Text style={styles.countText}>{count > 99 ? '99+' : count}</Text>
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    backgroundColor: 'rgba(70, 72, 212, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  countText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default ClusterMarker;