import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useThemeStore } from '../../store/stores';

const PlaceSearchBar = ({
  onSearch,
  onClear,
  isLoading = false,
  placeholder = 'Cari venue atau tempat...',
}) => {
  const [query, setQuery] = useState('');
  const { isDark } = useThemeStore();
  const theme = isDark ? darkTheme : lightTheme;

  const handleSubmit = () => {
    if (query.trim()) onSearch?.(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onClear?.();
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.bg, borderColor: theme.border }]}>
      <Text style={styles.searchIcon}>🔍</Text>

      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoCorrect={false}
      />

      {isLoading ? (
        <ActivityIndicator size="small" color="#4648d4" style={styles.rightIcon} />
      ) : query.length > 0 ? (
        <TouchableOpacity onPress={handleClear} style={styles.rightIcon}>
          <View style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const lightTheme = {
  bg: '#ffffff',
  border: '#e4e1ed',
  text: '#1b1b23',
  placeholder: '#64748B',
};

const darkTheme = {
  bg: '#1e1e2a',
  border: '#2f2f40',
  text: '#f2effb',
  placeholder: '#6b7280',
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 8,
    shadowColor: '#4648d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: { fontSize: 16 },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    padding: 0,
  },
  rightIcon: { marginLeft: 4 },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#c7c4d7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: { fontSize: 10, color: '#464554', fontWeight: '700' },
});

export default PlaceSearchBar;