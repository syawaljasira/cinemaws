import type { Movie } from "@/types/movie.ts";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useSearchStore = defineStore(
  "search",
  () => {
    const route = useRoute();
    const router = useRouter();

    const search = ref<string>("");

    function handleSearch() {
      router.push({
        path: "/search",
        query: {
          ...route.query,
          search: search.value,
        },
      });
    }

    function clear() {
      search.value = "";
    }

    return { search, clear, handleSearch };
  },
  //   { persist: true } // requires pinia-plugin-persistedstate
);
