import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useAuth } from "../../hooks/useAuth";
import {
  getPost,
  getUserProfile,
  likePost,
  unlikePost,
  hasLikedPost,
  addComment,
  getComments,
} from "../../services/firestoreService";

export default function PostDetailScreen({ route, navigation }) {
  const { postId } = route.params || {};
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    if (!postId) return;

    const fetchPostData = async () => {
      try {
        const postData = await getPost(postId);
        // Enrich with author profile
        if (postData && postData.authorId) {
          try {
            const author = await getUserProfile(postData.authorId);
            postData.authorName = author?.displayName || 'Explorer';
            postData.authorAvatar = author?.photoURL || '';
          } catch (e) {
            postData.authorName = 'Explorer';
            postData.authorAvatar = '';
          }
        }
        setPost(postData);

        if (user) {
          const liked = await hasLikedPost(postId, user.uid);
          setIsLiked(liked);
        }

        const commentsData = await getComments(postId);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching post data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId, user]);

  const handleLikeToggle = async () => {
    if (!user || !post) return;

    // Optimistic UI update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setPost((prev) => ({
      ...prev,
      likesCount: wasLiked ? Math.max(0, prev.likesCount - 1) : prev.likesCount + 1,
    }));

    try {
      if (wasLiked) {
        await unlikePost(post.id, user.uid);
      } else {
        await likePost(post.id, user.uid);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update
      setIsLiked(wasLiked);
      setPost((prev) => ({
        ...prev,
        likesCount: wasLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1),
      }));
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !user || !post) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setCommentError(null);

    try {
      const commentData = {
        authorId: user.uid,
        authorName: user.displayName || "Explorer",
        authorAvatar: user.photoURL || "https://via.placeholder.com/40",
        content: commentText.trim(),
      };

      const commentId = await addComment(post.id, commentData);
      
      // Update local state
      setComments([
        { id: commentId, ...commentData, createdAt: "Just now" },
        ...comments,
      ]);
      setPost((prev) => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setCommentError("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4648d4" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#ba1a1a" />
        <Text style={styles.errorTitle}>Discovery story not found</Text>
        <Text style={styles.errorSub}>This post metadata could not be fetched from secure repositories.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back to Feed Timeline</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackButton}>
          <Ionicons name="arrow-back" size={24} color="#4648d4" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Post Coordinates</Text>
          <Text style={styles.headerSubtitle}>Story ID: #{post.id.substring(0, 8)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Post Card */}
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.authorRow}>
              <TouchableOpacity onPress={() => {}}>
                <Image source={{ uri: post.authorAvatar || "https://via.placeholder.com/40" }} style={styles.authorAvatar} />
              </TouchableOpacity>
              <View>
                <Text style={styles.authorName}>{post.authorName}</Text>
                <View style={styles.timeRow}>
                  <Ionicons name="time-outline" size={12} color="#64748B" />
                  <Text style={styles.timeText}>Captured {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Recently'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{post.category || "General"}</Text>
            </View>
          </View>

          {post.imageURL && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: post.imageURL }} style={styles.postImage} />
              <View style={styles.imageOverlay} />
              <View style={styles.locationBadge}>
                <Ionicons name="location" size={16} color="#fb923c" />
                <Text style={styles.locationBadgeText}>{post.locationLabel || "Unknown Location"}</Text>
              </View>
            </View>
          )}

          <View style={styles.postContentContainer}>
            <Text style={styles.postContentText}>{post.caption || post.description || post.content}</Text>
            
            <View style={styles.postActions}>
              <TouchableOpacity 
                style={[styles.likeButton, isLiked && styles.likedButton]} 
                onPress={handleLikeToggle}
              >
                <Ionicons name={isLiked ? "heart" : "heart-outline"} size={20} color={isLiked ? "#ba1a1a" : "#464554"} />
                <Text style={[styles.likeText, isLiked && styles.likedText]}>{post.likesCount || 0} Likes</Text>
              </TouchableOpacity>
              <View style={styles.geofenceBadge}>
                <Text style={styles.geofenceText}>GEOFENCE: {post.lat ? `${post.lat.toFixed(4)}°N` : "UNKNOWN"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsHeader}>Explorers Conversation ({comments.length})</Text>

          {/* Comment Input */}
          <View style={styles.commentInputContainer}>
            {commentError && (
              <View style={styles.errorBanner}>
                <Ionicons name="warning" size={16} color="#ba1a1a" />
                <Text style={styles.errorText}>{commentError}</Text>
              </View>
            )}
            <View style={styles.commentForm}>
              <TextInput
                style={styles.input}
                value={commentText}
                onChangeText={(text) => {
                  setCommentText(text);
                  if (commentError) setCommentError(null);
                }}
                placeholder="Join conversation..."
                placeholderTextColor="#9ca3af"
                maxLength={150}
              />
              <TouchableOpacity
                style={[styles.submitButton, (!commentText.trim() || isSubmitting) && styles.submitButtonDisabled]}
                onPress={handleCommentSubmit}
                disabled={!commentText.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Post</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Comment List */}
          {comments.length === 0 ? (
            <View style={styles.emptyComments}>
              <Text style={styles.emptyCommentsText}>Be the first to share your coordinates feedback!</Text>
            </View>
          ) : (
            <View style={styles.commentsList}>
              {comments.map((comment, index) => (
                <Animated.View 
                  key={comment.id} 
                  entering={FadeInDown.delay(index * 100).duration(400)}
                  style={styles.commentCard}
                >
                  <Image source={{ uri: comment.authorAvatar || "https://via.placeholder.com/40" }} style={styles.commentAvatar} />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeaderRow}>
                      <Text style={styles.commentAuthor}>{comment.authorName}</Text>
                      <Text style={styles.commentTime}>
                        {typeof comment.createdAt === "string" 
                          ? comment.createdAt 
                          : comment.createdAt?.toDate 
                            ? comment.createdAt.toDate().toLocaleDateString() 
                            : ""}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(252, 248, 255, 0.9)",
  },
  headerBackButton: {
    padding: 6,
    marginLeft: -4,
    marginRight: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b1b23",
  },
  headerSubtitle: {
    fontSize: 10,
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  postCard: {
    backgroundColor: "white",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(199, 196, 215, 0.4)",
    overflow: "hidden",
  },
  postHeader: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(239, 236, 248, 0.7)",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dae2fd",
    marginRight: 12,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1b1b23",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  timeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: "rgba(218, 226, 253, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 9,
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#4648d4",
    textTransform: "uppercase",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#f1f5f9",
    position: "relative",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  locationBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  locationBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  postContentContainer: {
    padding: 20,
  },
  postContentText: {
    fontSize: 14,
    color: "#1b1b23",
    lineHeight: 22,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#efecf8",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  likedButton: {
    backgroundColor: "#fef2f2",
  },
  likeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#464554",
    marginLeft: 8,
  },
  likedText: {
    color: "#ba1a1a",
  },
  geofenceBadge: {
    backgroundColor: "#eef2ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  geofenceText: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "#6366f1",
    textTransform: "uppercase",
  },
  commentsSection: {
    marginTop: 24,
  },
  commentsHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 4,
    marginBottom: 16,
  },
  commentInputContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(199, 196, 215, 0.4)",
    marginBottom: 16,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    marginBottom: 12,
  },
  errorText: {
    fontSize: 11,
    color: "#ba1a1a",
    fontWeight: "500",
    marginLeft: 6,
  },
  commentForm: {
    flexDirection: "row",
  },
  input: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "rgba(199, 196, 215, 0.5)",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 40,
    fontSize: 12,
    color: "#1b1b23",
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#4648d4",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  submitButtonDisabled: {
    backgroundColor: "#f1f5f9",
    borderColor: "rgba(226, 232, 240, 0.5)",
    borderWidth: 1,
  },
  submitButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyComments: {
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderWidth: 1,
    borderColor: "#efecf8",
    borderRadius: 16,
    alignItems: "center",
  },
  emptyCommentsText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  commentsList: {
    gap: 12,
  },
  commentCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(199, 196, 215, 0.35)",
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#eef2ff",
  },
  commentContent: {
    flex: 1,
  },
  commentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1b1b23",
  },
  commentTime: {
    fontSize: 9,
    fontFamily: "monospace",
    color: "#767586",
  },
  commentText: {
    fontSize: 12,
    color: "#444",
    lineHeight: 18,
  },
});
