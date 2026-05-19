import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  AppState,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MovieCard from '../components/MovieCard';
import { ACCENT, colors } from '../theme/colors';
import { MoviesStackParamList } from '../navigation/MoviesStack';
import { loadPopular } from '../Store/moviesSlice';
import { useAppDispatch, useAppSelector } from '../Store/store';
import type { Movie } from '../Types/types';

type NavigationProp = NativeStackNavigationProp<MoviesStackParamList, 'List'>;

function ListEmpty({
  isLoading,
  message,
}: {
  isLoading: boolean;
  message: string;
}) {
  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text style={styles.emptyText}>Fetching movies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export default function ListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const {
    popularMovies,
    popularPage,
    popularTotalPages,
    loading,
    error,
  } = useAppSelector(state => state.movies);

  useEffect(() => {
    if (popularMovies.length === 0) {
      dispatch(loadPopular(1));
    }
  }, [dispatch, popularMovies.length]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (
        nextState === 'active' &&
        (error || popularMovies.length === 0) &&
        !loading
      ) {
        dispatch(loadPopular(1));
      }
    });
    return () => subscription.remove();
  }, [dispatch, error, popularMovies.length, loading]);

  const loadMore = () => {
    const hasMore = popularPage < popularTotalPages;
    if (loading || !hasMore || popularPage === 0) {
      return;
    }
    dispatch(loadPopular(popularPage + 1));
  };

  const onRefresh = useCallback(() => {
    dispatch(loadPopular(1));
  }, [dispatch]);

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

  const isLoadingMore = loading && popularMovies.length > 0;
  const isRefreshing = loading && popularPage <= 1;

  return (
    <View style={styles.container}>
      <FlatList
        data={popularMovies}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={[
          styles.listContent,
          popularMovies.length === 0 && styles.listContentEmpty,
        ]}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={ACCENT}
            colors={[ACCENT]}
          />
        }
        ListEmptyComponent={
          <ListEmpty
            isLoading={loading && popularMovies.length === 0}
            message={
              error ?? "Couldn't load movies. Pull down to try again."
            }
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
  listContent: {
    paddingTop: 16,
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
