import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MovieCard from '../components/MovieCard';
import { ACCENT, colors } from '../theme/colors';
import { FavoritesStackParamList } from '../navigation/FavoritesStack';
import { fetchMovieDetails } from '../services/tmdb';
import { useAppSelector } from '../Store/store';
import type { Movie } from '../Types/types';

type NavigationProp = NativeStackNavigationProp<
  FavoritesStackParamList,
  'FavoritesList'
>;

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const favoriteIds = useAppSelector(state => state.movies.favorites);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      if (favoriteIds.length === 0) {
        setMovies([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await Promise.all(
          favoriteIds.map(id => fetchMovieDetails(id)),
        );
        if (!cancelled) {
          setMovies(results);
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof Error
              ? err.message
              : "Couldn't load your favorites.";
          setError(msg);
          setMovies([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFavorites();
    return () => {
      cancelled = true;
    };
  }, [favoriteIds]);

  const renderItem: ListRenderItem<Movie> = useCallback(
    ({ item }) => (
      <MovieCard
        item={item}
        onPress={() =>
          navigation.navigate('Details', { movieId: item.id })
        }
      />
    ),
    [navigation],
  );

  if (loading && movies.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text style={styles.hint}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorites</Text>
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={[
          styles.listContent,
          movies.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {error ??
                (favoriteIds.length === 0
                  ? 'No favorites yet. Open a movie and tap “Add to favorites”.'
                  : 'No movies to show.')}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
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
  header: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 32,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  hint: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
