import { TMDB, BASE_URL } from '../config/dotenv';
import type {
  MovieDetails,
  TMDBError,
  TMDBResponse,
} from '../Types/types';

const isAccessToken = (token: string): boolean => token.startsWith('eyJ');

function buildRequest(path: string, query: Record<string, string> = {}) {
  if (!TMDB) {
    throw new Error(
      'Missing TMDB API key. Check your .env file and restart Metro.',
    );
  }

  const params = new URLSearchParams({ language: 'en-US', ...query });
  const headers: Record<string, string> = { accept: 'application/json' };

  if (isAccessToken(TMDB)) {
    headers.Authorization = `Bearer ${TMDB}`;
  } else {
    params.set('api_key', TMDB);
  }

  return { url: `${BASE_URL}${path}?${params}`, headers };
}

async function tmdbGet<T>(path: string, query: Record<string, string> = {}) {
  const { url, headers } = buildRequest(path, query);
  const res = await fetch(url, { method: 'GET', headers });
  const data = (await res.json()) as T & TMDBError;

  if (!res.ok) {
    throw new Error(data.status_message ?? `Request failed (${res.status})`);
  }

  return data;
}

export async function fetchPopularMovies(page: number): Promise<TMDBResponse> {
  const data = await tmdbGet<TMDBResponse>('/movie/popular', {
    page: String(page),
  });
  return { ...data, results: data.results ?? [] };
}

export async function searchMovies(
  query: string,
  page: number,
): Promise<TMDBResponse> {
  const data = await tmdbGet<TMDBResponse>('/search/movie', {
    query,
    page: String(page),
    include_adult: 'false',
  });
  return { ...data, results: data.results ?? [] };
}

export async function fetchMovieDetails(movieId: number): Promise<MovieDetails> {
  return tmdbGet<MovieDetails>(`/movie/${movieId}`, {
    append_to_response: 'credits',
  });
}
