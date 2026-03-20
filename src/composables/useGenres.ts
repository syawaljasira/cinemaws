import { ref } from "vue";
import { movieService } from "@/services/movieService";
import type { Genre } from "@/types/movie";

export function useGenres() {
  const genres = ref<Genre[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetch() {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await movieService.getGenres();
      genres.value = data.genres;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load genres";
    } finally {
      isLoading.value = false;
    }
  }

  return { genres, isLoading, error, fetch };
}
