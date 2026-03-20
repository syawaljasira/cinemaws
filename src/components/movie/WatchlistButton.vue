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
    class="flex items-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none"
    :class="[
      isWatchlisted
        ? 'bg-primary text-gray-900 hover:bg-yellow-300'
        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white',
      size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
    ]"
    @click="watchlistStore.toggle(movie)"
  >
    <svg
      class="w-4 h-4 shrink-0"
      :fill="isWatchlisted ? 'currentColor' : 'none'"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
    {{ isWatchlisted ? "Watchlisted" : "Add to Watchlist" }}
  </button>
</template>
