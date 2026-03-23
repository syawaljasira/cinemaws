import type { Movie } from "@/types/movie.ts";
import { useDebounceFn } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSearchMovies } from "@/composables/useSearchMovies.ts";
import { useSearchCast } from "@/composables/useSearchCast.ts";

export const useSearchStore = defineStore(
  "search",
  () => {
    const route = useRoute();
    const router = useRouter();

    const search = ref<string>("");
    const isFocus = ref<boolean>(false);

    const {
      query: movieQuery,
      results: movieResults,
      isLoading: isMovieLoading,
      debouncedSearch: debouncedSearchMovies,
    } = useSearchMovies();
    const {
      query: castQuery,
      cast: castResults,
      isLoading: isCastLoading,
      debouncedSearch: debouncedSearchCast,
    } = useSearchCast();

    // ─── Sync search → query masing-masing composable ─────────────────────────
    watch(search, (val) => {
      movieQuery.value = val;
      castQuery.value = val;
      debouncedSearchMovies();
      debouncedSearchCast();
    });

    const movieSuggestions = computed(() => movieResults.value.slice(0, 4));
    const castSuggestions = computed(() => castResults.value.slice(0, 2));

    const isMovieEmpty = computed(
      () => !isMovieLoading.value && movieSuggestions.value.length === 0 && !!search.value.trim(),
    );

    const isCastEmpty = computed(
      () => !isCastLoading.value && castSuggestions.value.length === 0 && !!search.value.trim(),
    );

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
      movieSuggestions,
      castSuggestions,
      isCastLoading,
      isMovieLoading,
      isMovieEmpty,
      isCastEmpty,
    };
  },
  //   { persist: true } // requires pinia-plugin-persistedstate
);
