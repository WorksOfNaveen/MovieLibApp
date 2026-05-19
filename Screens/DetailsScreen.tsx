import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ACCENT, colors } from '../theme/colors';
import { IMAGE_URL } from '../config/dotenv';
import { MoviesStackParamList } from '../navigation/MoviesStack';
import { fetchMovieDetails } from '../services/tmdb';
import { toggleFavorite } from '../Store/moviesSlice';
import { useAppDispatch, useAppSelector } from '../Store/store';
import type { CastMember, MovieDetails } from '../Types/types';

type Props = NativeStackScreenProps<MoviesStackParamList, 'Details'>;

export default function DetailsScreen({ route }: Props) {
  const { movieId } = route.params;
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.movies.favorites);
  const isFavorite = favorites.includes(movieId);

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMovieDetails(movieId);
        if (!cancelled) {
          setMovie(data);
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : "Couldn't load movie details.";
          setError(msg);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text style={styles.hint}>Loading movie...</Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error ?? 'Movie not found.'}</Text>
      </View>
    );
  }

  const posterUri = movie.poster_path
    ? `${IMAGE_URL}${movie.poster_path}`
    : null;
  const cast = movie.credits?.cast?.slice(0, 10) ?? [];
  const genreNames = movie.genres?.map(g => g.name).join(', ') ?? '';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {posterUri ? (
        <Image source={{ uri: posterUri }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.posterPlaceholder]}>
          <Text style={styles.placeholderText}>No poster</Text>
        </View>
      )}

      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.meta}>
        {movie.release_date || 'Unknown date'}
        {movie.runtime ? ` · ${movie.runtime} min` : ''}
        {movie.vote_average ? ` · ★ ${movie.vote_average.toFixed(1)}` : ''}
      </Text>
      {genreNames ? <Text style={styles.genres}>{genreNames}</Text> : null}

      <Pressable
        style={[styles.favButton, isFavorite && styles.favButtonActive]}
        onPress={() => dispatch(toggleFavorite(movieId))}>
        <Text
          style={[
            styles.favButtonText,
            isFavorite && styles.favButtonTextActive,
          ]}>
          {isFavorite ? '★ In favorites' : '☆ Add to favorites'}
        </Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Overview</Text>
      <Text style={styles.overview}>
        {movie.overview || 'No description available.'}
      </Text>

      {cast.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Cast</Text>
          <FlatList
            horizontal
            data={cast}
            keyExtractor={item => String(item.id)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }: { item: CastMember }) => (
              <View style={styles.castCard}>
                {item.profile_path ? (
                  <Image
                    source={{ uri: `${IMAGE_URL}${item.profile_path}` }}
                    style={styles.castImage}
                  />
                ) : (
                  <View style={[styles.castImage, styles.castPlaceholder]}>
                    <Text style={styles.castPlaceholderText}>?</Text>
                  </View>
                )}
                <Text style={styles.castName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.castRole} numberOfLines={1}>
                  {item.character}
                </Text>
              </View>
            )}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  hint: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 15,
  },
  error: {
    color: ACCENT,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  poster: {
    width: '100%',
    height: 280,
    backgroundColor: colors.surfaceMuted,
  },
  posterPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.textPlaceholder,
    fontSize: 14,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 16,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 14,
    marginHorizontal: 16,
    marginTop: 6,
  },
  genres: {
    color: colors.textMuted,
    fontSize: 13,
    marginHorizontal: 16,
    marginTop: 4,
  },
  favButton: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
  },
  favButtonActive: {
    backgroundColor: colors.accent,
  },
  favButtonText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  favButtonTextActive: {
    color: colors.accentContrast,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  overview: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginHorizontal: 16,
  },
  castCard: {
    width: 100,
    marginLeft: 16,
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceMuted,
    alignSelf: 'center',
  },
  castPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  castPlaceholderText: {
    color: colors.textPlaceholder,
    fontSize: 20,
  },
  castName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  castRole: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
});
