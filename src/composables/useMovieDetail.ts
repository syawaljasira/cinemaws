import { ref } from "vue";
import { movieService } from "@/services/movieService";
import type { MovieDetail, Credits } from "@/types/movie";

export function useMovieDetail() {
  const movie = ref<MovieDetail | null>(null);
  const credits = ref<Credits | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetch(id: number) {
    isLoading.value = true;
    error.value = null;
    movie.value = null;
    credits.value = null;

    try {
      const [movieRes, creditsRes] = await Promise.all([
        movieService.getMovieById(id),
        movieService.getMovieCredits(id),
      ]);
      movie.value = movieRes.data;
      credits.value = creditsRes.data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load movie details";
    } finally {
      isLoading.value = false;
    }
  }

  return { movie, credits, isLoading, error, fetch };
}
