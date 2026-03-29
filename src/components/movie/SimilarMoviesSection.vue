<script setup lang="ts">
import { ref, watch } from "vue";
import { movieService } from "@/services/movieService";
import MovieCard from "./MovieCard.vue";
import type { Movie } from "@/types/movie";

const props = defineProps<{
  movieId: number;
}>();

const movies = ref<Movie[]>([]);
const isLoading = ref(false);

async function fetchSimilar(id: number) {
  isLoading.value = true;
  try {
    const { data } = await movieService.getSimilarMovies(id);
    movies.value = data.results.slice(0, 10);
  } catch {
    movies.value = [];
  } finally {
    isLoading.value = false;
  }
}

watch(() => props.movieId, fetchSimilar, { immediate: true });
</script>

<template>
  <section v-if="isLoading || movies.length">
    <h2 class="text-gray-700 dark:text-white font-semibold text-xl mb-5">More Like This</h2>

    <!-- Skeleton -->
    <div
      v-if="isLoading"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      <div
        v-for="n in 5"
        :key="n"
        class="bg-gray-300 dark:bg-gray-800 rounded-xl overflow-hidden animate-pulse"
      >
        <div class="aspect-2/3 bg-gray-400 dark:bg-gray-700" />
        <div class="p-3 space-y-2">
          <div class="h-3 bg-gray-400 dark:bg-gray-700 rounded w-3/4" />
          <div class="h-2.5 bg-gray-400 dark:bg-gray-700 rounded w-1/3" />
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>
  </section>
</template>
