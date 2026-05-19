import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { IMAGE_URL } from '../config/dotenv';
import { colors } from '../theme/colors';
import type { Movie } from '../Types/types';

interface MovieCardProps {
  item: Movie;
  onPress?: () => void;
}

function MovieCard({ item, onPress }: MovieCardProps) {
  const posterUri = item.poster_path ? `${IMAGE_URL}${item.poster_path}` : null;

  const content = (
    <>
      {posterUri ? (
        <Image
          source={{ uri: posterUri }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, styles.placeholderPoster]}>
          <Text style={styles.placeholderText}>No poster</Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.releaseDate}>
          Released: {item.release_date || 'Unknown'}
        </Text>
        <Text style={styles.overview} numberOfLines={3}>
          {item.overview || 'No description available.'}
        </Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

export default memo(MovieCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardPressed: {
    opacity: 0.9,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
  },
  placeholderPoster: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  placeholderText: {
    fontSize: 11,
    color: colors.textPlaceholder,
    textAlign: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  releaseDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  overview: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});

export { ACCENT } from '../theme/colors';
