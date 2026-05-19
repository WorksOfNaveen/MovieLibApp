import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchPopularMovies,
  searchMovies as searchMoviesApi,
} from '../services/tmdb';
import type { Movie } from '../Types/types';

interface MoviesState {
  popularMovies: Movie[];
  popularPage: number;
  popularTotalPages: number;
  searchResults: Movie[];
  searchPage: number;
  searchTotalPages: number;
  searchQuery: string;
  favorites: number[];
  loading: boolean;
  error: string | null;
}

const mergeMovies = (existing: Movie[], incoming: Movie[]): Movie[] => {
  const seen = new Set(existing.map(movie => movie.id));
  const unique = incoming.filter(movie => !seen.has(movie.id));
  return [...existing, ...unique];
};

const initialState: MoviesState = {
  popularMovies: [],
  popularPage: 0,
  popularTotalPages: 1,
  searchResults: [],
  searchPage: 0,
  searchTotalPages: 1,
  searchQuery: '',
  favorites: [],
  loading: false,
  error: null,
};

export const loadPopular = createAsyncThunk(
  'movies/loadPopular',
  async (page: number) => {
    const data = await fetchPopularMovies(page);
    return { page, data };
  },
  {
    condition: (page, { getState }) => {
      const { loading, popularPage } = (getState() as { movies: MoviesState })
        .movies;
      if (loading) {
        return false;
      }
      if (page > 1 && page <= popularPage) {
        return false;
      }
      return true;
    },
  },
);

export const loadSearch = createAsyncThunk(
  'movies/loadSearch',
  async ({ query, page }: { query: string; page: number }) => {
    const data = await searchMoviesApi(query, page);
    return { query, page, data };
  },
  {
    condition: ({ query, page }, { getState }) => {
      const { loading, searchPage, searchQuery } = (
        getState() as { movies: MoviesState }
      ).movies;
      if (loading) {
        return false;
      }
      if (query === searchQuery && page > 1 && page <= searchPage) {
        return false;
      }
      return true;
    },
  },
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<number>) {
      const id = action.payload;
      const index = state.favorites.indexOf(id);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(id);
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadPopular.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPopular.fulfilled, (state, action) => {
        const { page, data } = action.payload;
        state.loading = false;
        state.popularPage = page;
        state.popularTotalPages = data.total_pages;
        state.popularMovies =
          page === 1 ? data.results : mergeMovies(state.popularMovies, data.results);
      })
      .addCase(loadPopular.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ??
          "Couldn't load movies. Pull down to try again.";
      })
      .addCase(loadSearch.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSearch.fulfilled, (state, action) => {
        const { query, page, data } = action.payload;
        state.loading = false;
        state.searchQuery = query;
        state.searchPage = page;
        state.searchTotalPages = data.total_pages;
        state.searchResults =
          page === 1
            ? data.results
            : mergeMovies(state.searchResults, data.results);
      })
      .addCase(loadSearch.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Couldn't search movies. Try again.";
      });
  },
});

export const { toggleFavorite, clearError } = moviesSlice.actions;
export default moviesSlice.reducer;
