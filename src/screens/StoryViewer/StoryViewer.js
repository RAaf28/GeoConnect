import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { useWindowDimensions } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import {
  likePost,
  unlikePost,
  hasLikedPost,
} from '../../services/firestoreService';

export default function StoryViewer({ route, navigation }) {
  const { posts = [], initialIndex = 0 } = route.params || {};
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [likedStates, setLikedStates] = useState({}); // postId -> boolean
  const [localPosts, setLocalPosts] = useState(posts); // mutable copy for optimistic updates

  // Initialize liked states for each post based on initial props
  useEffect(() => {
    const initialLikes = {};
    posts.forEach((post) => {
      initialLikes[post.id] = false; // will load async if needed
    });
    setLikedStates(initialLikes);
  }, [posts]); // reset if posts prop changes (shouldn't happen in practice)

  // Load like status for current post when it changes (to correct optimistic state)
  useEffect(() => {
    if (!user || !localPosts[currentIndex]) return;
    const loadLiked = async () => {
      try {
        const liked = await hasLikedPost(
          localPosts[currentIndex].id,
          user.uid
        );
        setLikedStates((prev) => ({
          ...prev,
          [localPosts[currentIndex].id]: liked,
        }));
      } catch (e) {
        console.error('Failed to load like status', e);
      }
    };
    loadLiked();
  }, [user, currentIndex, localPosts]); // note: localPosts changes when we like, but we only care about currentIndex

  const handleLikeToggle = async () => {
    if (!user || !localPosts[currentIndex]) return;

    const postId = localPosts[currentIndex].id;
    const currentlyLiked = likedStates[postId];
    const newLiked = !currentlyLiked;

    // Optimistic update: toggle liked state and adjust likes count
    setLikedStates((prev) => ({
      ...prev,
      [postId]: newLiked,
    }));
    setLocalPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likesCount: (post.likesCount ?? 0) + (currentlyLiked ? -1 : 1) }
          : post
      )
    );

    try {
      if (newLiked) {
        await likePost(postId, user.uid);
      } else {
        await unlikePost(postId, user.uid);
      }
    } catch (err) {
      // Rollback optimistic update
      setLikedStates((prev) => ({
        ...prev,
        [postId]: !newLiked, // revert to original
      }));
      setLocalPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likesCount: (post.likesCount ?? 0) + (newLiked ? -1 : 1), // revert the change
              }
            : post
        )
      );
      console.error('Like/error', err);
    }
  };

  const renderStoryItem = ({ index }) => {
    const post = localPosts[index];
    return (
      <View style={styles.slide}>
        {post.imageURL ? (
          <Image
            source={{ uri: post.imageURL }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholder, styles.image]}>
            <Text style={styles.placeholderText}>
              {post.locationLabel || 'No Image'}
            </Text>
          </View>
        )}
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>×</Text>
            </TouchableOpacity>
            <View style={styles.statusContainer}>
              <Text style={styles.indexText}>
                {currentIndex + 1}/{localPosts.length}
              </Text>
            </View>
          </View>
          <View style={styles.content}>
            {/* User info */}
            <View style={styles.userRow}>
              {post.authorPhoto ? (
                <Image
                  source={{ uri: post.authorPhoto }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.placeholder]}>
                  <Text style={styles.avatarText}>
                    {(post.authorName || 'U').charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.userInfo}>
                <Text style={styles.username}>
                  {post.authorName || 'Explorer'}
                </Text>
                <Text style={styles.location}>
                  {post.locationLabel || 'Unknown location'}
                </Text>
              </View>
            </View>
            {/* Caption */}
            {post.caption && (
              <Text style={styles.caption}>{post.caption}</Text>
            )}
            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  actionsButton,
                  likedStates[post.id] && likedButton,
                ]}
                onPress={handleLikeToggle}
              >
                <Text style={actionText}>
                  {likedStates[post.id] ? '❤' : '♡'}
                  {' '}
                  {post.likesCount ?? 0}
                </Text>
              </TouchableOpacity>
              {/* Optional: share or comment button */}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const onMomentumScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const { width } = useWindowDimensions();

  if (!localPosts.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredMessage}>
          <Text style={styles.noStoriesText}>No stories available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={localPosts}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        onMomentumScrollEnd={onMomentumScrollEnd}
        removesClippedSubviews={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        overScrollMode="never"
        contentContainerStyle={styles.slider}
      />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slider: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#000',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholder: {
    backgroundColor: '#222',
  },
  placeholderText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 80,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flexDirection: 'column',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#444',
  },
  avatarText: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 36,
    fontWeight: '600',
    fontSize: 14,
  },
  userInfo: {},
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  location: {
    color: '#aaa',
    fontSize: 12,
  },
  caption: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    maxWidth: '80%',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginRight: 12,
  },
  likedButton: {
    backgroundColor: 'rgba(255,0,0,0.3)',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noStoriesText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});