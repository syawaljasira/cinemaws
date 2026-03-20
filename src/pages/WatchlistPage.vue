<script setup lang="ts">
import { ref } from "vue";
import { useWatchlistStore } from "@/stores/watchlist";
import MovieCard from "@/components/movie/MovieCard.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import BaseButton from "@/components/common/BaseButton.vue";

const watchlistStore = useWatchlistStore();
const confirmClear = ref(false);

function handleClear() {
  if (!confirmClear.value) {
    confirmClear.value = true;
    setTimeout(() => (confirmClear.value = false), 3000);
    return;
  }
  watchlistStore.clear();
  confirmClear.value = false;
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-bold text-white">My Watchlist</h1>
        <p class="text-gray-500 text-sm">
          <template v-if="watchlistStore.count">
            {{ watchlistStore.count }} {{ watchlistStore.count === 1 ? "movie" : "movies" }} saved
          </template>
          <template v-else>No movies saved yet</template>
        </p>
      </div>

      <BaseButton
        v-if="watchlistStore.count > 0"
        :variant="confirmClear ? 'danger' : 'ghost'"
        size="sm"
        @click="handleClear"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        {{ confirmClear ? "Confirm Clear?" : "Clear All" }}
      </BaseButton>
    </div>

    <!-- Empty state -->
    <EmptyState
      v-if="!watchlistStore.count"
      icon="bookmark"
      title="Your watchlist is empty"
      description="Browse movies and click 'Add to Watchlist' to save them here."
    >
      <RouterLink
        :to="{ name: 'home' }"
        class="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-gray-900 font-semibold text-sm rounded-lg hover:bg-primary-light transition"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
          />
        </svg>
        Browse Movies
      </RouterLink>
    </EmptyState>

    <!-- Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <MovieCard v-for="movie in watchlistStore.items" :key="movie.id" :movie="movie" />
    </div>
  </div>
</template>
