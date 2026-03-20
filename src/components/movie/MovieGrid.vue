<script setup lang="ts">
import MovieCard from "./MovieCard.vue";
import LoadingState from "@/components/common/LoadingState.vue";
import type { Movie } from "@/types/movie";

defineProps<{
  movies: Movie[];
  loading?: boolean;
  skeletonCount?: number;
}>();
</script>

<template>
  <div>
    <!-- Skeleton loader -->
    <div
      v-if="loading && !movies.length"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      <div
        v-for="n in skeletonCount ?? 10"
        :key="n"
        class="bg-gray-800 rounded-xl overflow-hidden animate-pulse"
      >
        <div class="aspect-2/3 bg-gray-700" />
        <div class="p-3 space-y-2">
          <div class="h-3 bg-gray-700 rounded w-3/4" />
          <div class="h-2.5 bg-gray-700 rounded w-1/3" />
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>

    <!-- Load more spinner -->
    <LoadingState v-if="loading && movies.length > 0" message="Loading more..." class="py-8" />
  </div>
</template>
