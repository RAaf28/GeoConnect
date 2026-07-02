import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useNearbyPeople } from '../../hooks/useGeoQuery';
import { followUser, unfollowUser, isFollowing } from '../../services/firestoreService';

export default function NearbyPeopleScreen({ navigation }) {
  const { user } = useAuth();
  const { nearbyPeople, loading, error, refresh } = useNearbyPeople(1); // 1km radius
  const [followingMap, setFollowingMap] = useState({}); // userId => boolean

  // Preload following status for visible users
  useEffect(() => {
    if (!user || !nearbyPeople.length) return;
    const loadFollowing = async () => {
      const map = {};
      for (const person of nearbyPeople) {
        try {
          const followed = await isFollowing(person.id, user.uid);
          map[person.id] = followed;
        } catch (e) {
          console.error('Error checking follow status', e);
          map[person.id] = false;
        }
      }
      setFollowingMap(map);
    };
    loadFollowing();
  }, [user, nearbyPeople]);

  const handleFollowToggle = async (personId, currentlyFollowing) => {
    if (!user) return;
    try {
      if (currentlyFollowing) {
        await unfollowUser(personId, user.uid);
      } else {
        await followUser(personId, user.uid);
      }
      setFollowingMap(prev => ({ ...prev, [personId]: !currentlyFollowing }));
    } catch (err) {
      console.error('Follow/unfollow error', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4648d4" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error loading nearby people</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={nearbyPeople}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isFollowed = followingMap[item.id] ?? false;
          return (
            <View style={styles.item}>
              {item.authorPhoto ? (
                <Image source={{ uri: item.authorPhoto }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.placeholder]}>
                  <Text style={styles.avatarText}>
                    {(item.authorName || 'U').charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.info}>
                <Text style={styles.name}>{item.authorName || 'Unknown'}</Text>
                <Text style={styles.distance}>
                  {item.distance?.toFixed(1) ?? '?'} km
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.followButton,
                  isFollowed && styles.followedButton,
                ]}
                onPress={() => handleFollowToggle(item.id, isFollowed)}
              >
                <Text style={[
                  styles.followText,
                  isFollowed && styles.followedText,
                ]}>
                  {isFollowed ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf8ff' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  avatarText: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 50,
    fontWeight: '600',
    fontSize: 16,
  },
  placeholder: { backgroundColor: '#4648d4' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#1b1b23' },
  distance: { fontSize: 12, color: '#64748B', marginTop: 2 },
  followButton: {
    backgroundColor: '#4648d4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followedButton: { backgroundColor: '#e4e1ed' },
  followText: { color: '#fff', fontWeight: '600' },
  followedText: { color: '#464554' },
  separator: { height: 1, backgroundColor: '#f0f0f0' },
});