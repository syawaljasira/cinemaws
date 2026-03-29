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
        <h1 class="text-2xl font-bold text-gray-700 dark:text-white">My Watchlist</h1>
        <p class="text-gray-600 dark:text-gray-500 text-sm">
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
        <v-icon name="io-trash" class="w-4 h-4" />

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
        <v-icon name="hi-film" class="w-4 h-4" />

        Browse Movies
      </RouterLink>
    </EmptyState>

    <!-- Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <MovieCard v-for="movie in watchlistStore.items" :key="movie.id" :movie="movie" />
    </div>
  </div>
</template>
