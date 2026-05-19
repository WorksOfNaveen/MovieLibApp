import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MovieCard from '../components/MovieCard';
import { ACCENT, colors } from '../theme/colors';
import { RootTabParamList } from '../navigation/RootTabs';
import { loadSearch } from '../Store/moviesSlice';
import { useAppDispatch, useAppSelector } from '../Store/store';
import type { Movie } from '../Types/types';

type SearchNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Search'>,
  BottomTabNavigationProp<RootTabParamList>
>;

function SearchEmpty({
  query,
  isLoading,
  error,
  hasResults,
}: {
  query: string;
  isLoading: boolean;
  error: string | null;
  hasResults: boolean;
}) {
  if (!query.trim()) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Type a movie name to search</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text style={styles.emptyText}>Searching...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!hasResults) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No results for "{query}"</Text>
      </View>
    );
  }

  return null;
}

export default function SearchScreen() {
  const navigation = useNavigation<SearchNavProp>();
  const dispatch = useAppDispatch();
  const [text, setText] = useState('');
  const {
    searchResults,
    searchPage,
    searchTotalPages,
    searchQuery,
    loading,
    error,
  } = useAppSelector(state => state.movies);

  useEffect(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch(loadSearch({ query: trimmed, page: 1 }));
    }, 400);

    return () => clearTimeout(timer);
  }, [text, dispatch]);

  const loadMore = () => {
    const trimmed = text.trim();
    const hasMore = searchPage < searchTotalPages;
    if (!trimmed || loading || !hasMore || searchPage === 0) {
      return;
    }
    if (trimmed !== searchQuery) {
      return;
    }
    dispatch(loadSearch({ query: trimmed, page: searchPage + 1 }));
  };

  const renderItem: ListRenderItem<Movie> = useCallback(
    ({ item }) => (
      <MovieCard
        item={item}
        onPress={() =>
          navigation.navigate('Movies', {
            screen: 'Details',
            params: { movieId: item.id },
          })
        }
      />
    ),
    [navigation],
  );

  const trimmed = text.trim();
  const isLoadingMore = loading && searchResults.length > 0;
  const showResults = trimmed.length > 0 && trimmed === searchQuery;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search movies..."
        placeholderTextColor={colors.textPlaceholder}
        value={text}
        onChangeText={setText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      <FlatList
        data={showResults ? searchResults : []}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={[
          styles.listContent,
          !showResults || searchResults.length === 0
            ? styles.listContentEmpty
            : undefined,
        ]}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <SearchEmpty
            query={trimmed}
            isLoading={loading && searchResults.length === 0}
            error={error}
            hasResults={searchResults.length > 0}
          />
        }
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator
              style={styles.footer}
              size="large"
              color={ACCENT}
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  input: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 16,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 15,
    color: ACCENT,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingVertical: 24,
  },
});
