import { ref, computed } from "vue";
import { movieService } from "@/services/movieService";
import type { Movie, MovieListType } from "@/types/movie";

export function useMovies(type: MovieListType = "popular") {
  const movies = ref<Movie[]>([]);
  const page = ref(1);
  const totalPages = ref(1);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const hasMore = computed(() => page.value < totalPages.value);

  async function fetch(reset = false) {
    if (isLoading.value) return;
    if (reset) {
      page.value = 1;
      movies.value = [];
    }

    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await movieService.getMovies(type, page.value);
      movies.value = reset ? data.results : [...movies.value, ...data.results];
      totalPages.value = data.total_pages;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load movies";
    } finally {
      isLoading.value = false;
    }
  }

  async function loadMore() {
    if (!hasMore.value) return;
    page.value++;
    await fetch();
  }

  return { movies, page, totalPages, hasMore, isLoading, error, fetch, loadMore };
}
