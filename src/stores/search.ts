import type { Movie } from "@/types/movie.ts";
import { useDebounceFn } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { movieService } from "@/services/movieService.ts";

export const useSearchStore = defineStore(
  "search",
  () => {
    const route = useRoute();
    const router = useRouter();

    const search = ref<string>("");
    const isFocus = ref<boolean>(false);
    const suggestions = ref<Movie[]>([]);
    const isLoading = ref(false);
    const isEmpty = ref(false);

    const fetchSuggestions = useDebounceFn(async (keyword: string) => {
      if (!keyword.trim()) {
        suggestions.value = [];
        return;
      }

      isLoading.value = true;

      try {
        const { data } = await movieService.searchMovies(keyword);
        suggestions.value = data.results.slice(0, 5); // batasi 6 hasil
      } catch {
        suggestions.value = [];
      } finally {
        isLoading.value = false;

        if (!suggestions.value?.length) {
          isEmpty.value = true;
        } else {
          isEmpty.value = false;
        }
      }
    }, 400);

    // otomatis fetch saat query berubah
    watch(search, (val) => {
      fetchSuggestions(val);
    });

    function handleSearch() {
      isFocus.value = false;

      route?.path === "/search"
        ? router.push({
            query: {
              ...route.query,
              q: search.value,
            },
          })
        : router.push({
            path: "/search",
            query: {
              ...route.query,
              q: search.value,
            },
          });
    }

    function clear() {
      search.value = "";
    }

    const setFocus = (value: boolean) => {
      isFocus.value = value;
    };

    return {
      search,
      clear,
      handleSearch,
      isFocus,
      setFocus,
      suggestions,
      isLoading,
      isEmpty,
    };
  },
  //   { persist: true } // requires pinia-plugin-persistedstate
);
