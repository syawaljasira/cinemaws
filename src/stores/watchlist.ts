import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Movie } from "@/types/movie";

export const useWatchlistStore = defineStore(
  "watchlist",
  () => {
    const items = ref<Movie[]>([]);

    const count = computed(() => items.value.length);

    const isInWatchlist = (id: number) => items.value.some((m) => m.id === id);

    function add(movie: Movie) {
      if (!isInWatchlist(movie.id)) {
        items.value.push(movie);
      }
    }

    function remove(id: number) {
      items.value = items.value.filter((m) => m.id !== id);
    }

    function toggle(movie: Movie) {
      isInWatchlist(movie.id) ? remove(movie.id) : add(movie);
    }

    function clear() {
      items.value = [];
    }

    return { items, count, isInWatchlist, add, remove, toggle, clear };
  },
  //   { persist: true } // requires pinia-plugin-persistedstate
);
