import { TMDB, BaseUrl, ImageUrl } from './env.generated';

const DEFAULT_TMDB_BASE = 'https://api.themoviedb.org/3';
const DEFAULT_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

/** Strip trailing slashes and /movie/popular so the path is only appended once. */
const normalizeTmdbBaseUrl = (url: string): string => {
  const trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed) {
    return DEFAULT_TMDB_BASE;
  }
  return trimmed.replace(/\/movie\/popular$/i, '');
};

export { TMDB };
export const BASE_URL = normalizeTmdbBaseUrl(BaseUrl);
export const IMAGE_URL = ImageUrl.trim() || DEFAULT_IMAGE_BASE;
