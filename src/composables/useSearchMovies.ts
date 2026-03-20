import { ref } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { movieService } from "@/services/movieService";
import type { Movie } from "@/types/movie";

export function useSearchMovies() {
  const results = ref<Movie[]>([]);
  const query = ref("");
  const page = ref(1);
  const totalPages = ref(1);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function search(reset = true) {
    if (!query.value.trim()) {
      results.value = [];
      return;
    }

    if (reset) {
      page.value = 1;
      results.value = [];
    }

    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await movieService.searchMovies(query.value, page.value);
      results.value = reset ? data.results : [...results.value, ...data.results];
      totalPages.value = data.total_pages;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Search failed";
    } finally {
      isLoading.value = false;
    }
  }

  const debouncedSearch = useDebounceFn(() => search(true), 400);

  async function loadMore() {
    if (page.value >= totalPages.value) return;
    page.value++;
    await search(false);
  }

  return {
    query,
    results,
    page,
    totalPages,
    isLoading,
    error,
    search,
    debouncedSearch,
    loadMore,
  };
}
