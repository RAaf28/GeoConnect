import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useThemeStore } from '../../store/stores';

/**
 * LeaderboardItem - Item untuk leaderboard check-in per venue
 * @param {object} user - Data user { displayName, photoURL, checkinCount }
 * @param {number} rank - Urutan (1, 2, 3, dst)
 * @param {boolean} isTopThree - Jika true, tampilkan crown badge
 * @param {function} onPress
 */ 
const LeaderboardItem = ({ user, rank, onPress }) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? darkTheme : lightTheme;

  const isTopThree = rank <= 3;

  const rankConfig = {
    1: { crown: '👑', color: '#f59e0b', size: 52 },
    2: { crown: '🥈', color: '#9ca3af', size: 44 },
    3: { crown: '🥉', color: '#b45309', size: 44 },
  };

  const config = rankConfig[rank];

  // Top 3 tampil sebagai avatar besar
  if (isTopThree) {
    return (
      <TouchableOpacity
        style={styles.topThreeItem}
        onPress={() => onPress?.(user)}
        activeOpacity={0.8}
      >
        <View style={styles.crownWrapper}>
          <Text style={styles.crownIcon}>{config.crown}</Text>
        </View>
        <View style={[
          styles.avatarWrapper,
          { width: config.size + 4, height: config.size + 4, borderColor: config.color }
        ]}>
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={{ width: config.size, height: config.size, borderRadius: config.size / 2 }}
            />
          ) : (
            <View style={[
              styles.avatarPlaceholder,
              { width: config.size, height: config.size, borderRadius: config.size / 2, backgroundColor: theme.placeholder }
            ]}>
              <Text style={styles.avatarInitial}>
                {user?.displayName?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.topName, { color: theme.text }]} numberOfLines={1}>
          {user?.displayName?.split(' ')[0] || 'User'}
        </Text>
        <Text style={[styles.topCount, { color: theme.muted }]}>
          {user?.checkinCount || 0} check-in
        </Text>
      </TouchableOpacity>
    );
  }

  // Rank 4+ tampil sebagai list row
  return (
    <TouchableOpacity
      style={[styles.rowItem, { backgroundColor: theme.cardBg }]}
      onPress={() => onPress?.(user)}
      activeOpacity={0.8}
    >
      <Text style={[styles.rankNumber, { color: theme.muted }]}>{rank}</Text>

      {user?.photoURL ? (
        <Image source={{ uri: user.photoURL }} style={styles.rowAvatar} />
      ) : (
        <View style={[styles.rowAvatar, styles.rowAvatarPlaceholder, { backgroundColor: theme.placeholder }]}>
          <Text style={styles.rowAvatarInitial}>
            {user?.displayName?.[0]?.toUpperCase() || '?'}
          </Text>
        </View>
      )}

      <Text style={[styles.rowName, { color: theme.text }]} numberOfLines={1}>
        {user?.displayName || 'User'}
      </Text>

      <Text style={[styles.rowCount, { color: '#4648d4' }]}>
        {user?.checkinCount || 0} check-in
      </Text>
    </TouchableOpacity>
  );
};

const lightTheme = {
  cardBg: '#ffffff',
  text: '#1b1b23',
  muted: '#64748B',
  placeholder: '#efecf8',
};

const darkTheme = {
  cardBg: '#1e1e2a',
  text: '#f2effb',
  muted: '#9ca3af',
  placeholder: '#2a2a38',
};

const styles = StyleSheet.create({
  // Top 3
  topThreeItem: {
    alignItems: 'center',
    width: 80,
  },
  crownWrapper: {
    marginBottom: -8,
    zIndex: 1,
  },
  crownIcon: {
    fontSize: 20,
  },
  avatarWrapper: {
    borderWidth: 2.5,
    borderRadius: 999,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#4648d4',
    fontWeight: '700',
    fontSize: 18,
  },
  topName: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  topCount: {
    fontSize: 11,
    textAlign: 'center',
  },

  // Row item (rank 4+)
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  rankNumber: {
    width: 20,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  rowAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  rowAvatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowAvatarInitial: {
    color: '#4648d4',
    fontWeight: '700',
    fontSize: 14,
  },
  rowName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  rowCount: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default LeaderboardItem;