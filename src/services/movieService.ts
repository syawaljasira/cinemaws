import api from "./axios";
import type {
  Movie,
  MovieDetail,
  Genre,
  Credits,
  PaginatedResponse,
  MovieListType,
} from "@/types/movie";

export const movieService = {
  getMovies(type: MovieListType = "popular", page = 1) {
    return api.get<PaginatedResponse<Movie>>(`/movie/${type}`, { params: { page } });
  },

  getMovieById(id: number) {
    return api.get<MovieDetail>(`/movie/${id}`);
  },

  getMovieCredits(id: number) {
    return api.get<Credits>(`/movie/${id}/credits`);
  },

  getSimilarMovies(id: number, page = 1) {
    return api.get<PaginatedResponse<Movie>>(`/movie/${id}/similar`, { params: { page } });
  },

  searchMovies(query: string, page = 1) {
    return api.get<PaginatedResponse<Movie>>("/search/movie", {
      params: { query, page, include_adult: false },
    });
  },

  getGenres() {
    return api.get<{ genres: Genre[] }>("/genre/movie/list");
  },

  getMoviesByGenre(genreId: number, page = 1) {
    return api.get<PaginatedResponse<Movie>>("/discover/movie", {
      params: { with_genres: genreId, page, sort_by: "popularity.desc" },
    });
  },
};
