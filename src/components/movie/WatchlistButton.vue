<script setup lang="ts">
import { computed } from "vue";
import { useWatchlistStore } from "@/stores/watchlist";
import type { Movie } from "@/types/movie";

const props = defineProps<{
  movie: Movie;
  size?: "sm" | "md";
}>();

const watchlistStore = useWatchlistStore();
const isWatchlisted = computed(() => watchlistStore.isInWatchlist(props.movie.id));
</script>

<template>
  <button
    class="flex justify-center items-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none"
    :class="[
      isWatchlisted
        ? 'bg-primary text-gray-900 hover:bg-primary-light'
        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white',
      size === 'sm' ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm',
    ]"
    @click="watchlistStore.toggle(movie)"
  >
    <v-icon name="md-bookmarkborder-round" v-if="!isWatchlisted" class="w-5 h-5 shrink-0" />
    <v-icon name="md-bookmarkadded-round" v-else class="w-5 h-5 shrink-0" />

    {{ isWatchlisted ? "Watchlisted" : "Add to Watchlist" }}
  </button>
</template>
