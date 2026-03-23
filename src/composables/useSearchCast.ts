import { ref } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { movieService } from "@/services/movieService";
import type { Person } from "@/types/movie";

export function useSearchCast() {
  const query = ref("");
  const cast = ref<Person[]>([]);
  const page = ref(1);
  const totalPages = ref(1);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function search(reset = true) {
    if (!query.value.trim()) {
      cast.value = [];
      return;
    }

    if (reset) {
      page.value = 1;
      cast.value = [];
    }

    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await movieService.searchCast(query.value, page.value);

      cast.value = reset ? data.results : [...cast.value, ...data.results];
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
    cast,
    page,
    totalPages,
    isLoading,
    error,
    search,
    debouncedSearch,
    loadMore,
  };
}
