<script setup lang="ts">
import { useRoute } from "vue-router";
import { watch } from "vue";

import { formatRating, formatRuntime, formatCurrency } from "@/utils/formatRating";
import SimilarMoviesSection from "@/components/movie/SimilarMoviesSection.vue";
import LoadingState from "@/components/common/LoadingState.vue";
import { useMovieDetail } from "@/composables/useMovieDetail";
import ErrorState from "@/components/common/ErrorState.vue";
import MovieHero from "@/components/movie/MovieHero.vue";
import MovieMeta from "@/components/movie/MovieMeta.vue";
import { formatDate } from "@/utils/formatDate";

const props = defineProps<{
  id: number;
}>();

const { params } = useRoute();
const { movie, credits, isLoading, error, fetch } = useMovieDetail();

watch(
  () => params.id,
  (id) => fetch(Number(id)),
  { immediate: true },
);
</script>

<template>
  <div>
    <!-- Loading -->
    <LoadingState
      v-if="isLoading"
      message="Loading movie details..."
      :full-screen="true"
      parent-class="mt-24"
    />

    <!-- Error -->
    <ErrorState
      v-else-if="error"
      :message="error"
      retry-label="Try Again"
      @retry="fetch(props.id)"
      parent-class="mt-24"
    />

    <!-- Content -->
    <template v-else-if="movie">
      <!-- Hero -->
      <MovieHero :movie="movie" />

      <!-- Body -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Left: Overview + Cast + Similar -->
          <div class="lg:col-span-2 space-y-10">
            <!-- Overview -->
            <section>
              <h2 class="text-gray-700 dark:text-white font-semibold text-xl mb-3">Synopsis</h2>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ movie.overview || "No overview available." }}
              </p>
            </section>

            <!-- Cast (from MovieMeta) -->
            <MovieMeta :movie="movie" :credits="credits" />

            <!-- Similar movies -->
            <SimilarMoviesSection :movie-id="movie.id" />
          </div>

          <!-- Right: Sidebar details -->
          <aside class="space-y-6">
            <!-- Quick stats -->
            <div class="bg-primary/20 dark:bg-gray-800/60 rounded-xl p-5 space-y-4">
              <h3
                class="text-gray-700 dark:text-white font-semibold text-sm uppercase tracking-widest"
              >
                Movie Info
              </h3>

              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-500">Rating</span>
                  <span
                    class="text-amber-400 dark:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <v-icon name="md-star-round" class="w-3.5 h-3.5" />
                    {{ formatRating(movie.vote_average) }}
                    <span class="text-gray-900 dark:text-gray-500 font-normal"
                      >({{ movie.vote_count.toLocaleString() }})</span
                    >
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-500">Runtime</span>
                  <span class="text-gray-900 dark:text-white">{{
                    formatRuntime(movie.runtime)
                  }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-500">Release Date</span>
                  <span class="text-gray-900 dark:text-white">{{
                    formatDate(movie.release_date)
                  }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-500">Status</span>
                  <span
                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="
                      movie.status === 'Released'
                        ? 'bg-green-100/80 dark:bg-green-500/10 text-green-500 dark:text-green-400'
                        : 'bg-primary/10 text-primary border border-primary/20 dark:border-0'
                    "
                  >
                    {{ movie.status }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-500">Language</span>
                  <span class="text-gray-900 dark:text-white uppercase">{{
                    movie.original_language
                  }}</span>
                </div>

                <div v-if="movie.budget" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-500">Budget</span>
                  <span class="text-gray-900 dark:text-white">{{
                    formatCurrency(movie.budget)
                  }}</span>
                </div>

                <div v-if="movie.revenue" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-500">Revenue</span>
                  <span class="text-gray-900 dark:text-white">{{
                    formatCurrency(movie.revenue)
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Genres -->
            <div class="bg-primary/20 dark:bg-gray-800/60 rounded-xl p-5 space-y-3">
              <h3
                class="text-gray-700 dark:text-white font-semibold text-sm uppercase tracking-widest"
              >
                Genres
              </h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="genre in movie.genres"
                  :key="genre.id"
                  class="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
                >
                  {{ genre.name }}
                </span>
              </div>
            </div>

            <!-- Production companies -->
            <div
              v-if="movie.production_companies?.length"
              class="bg-primary/20 dark:bg-gray-800/60 rounded-xl p-5 space-y-3"
            >
              <h3
                class="text-gray-700 dark:text-white font-semibold text-sm uppercase tracking-widest"
              >
                Production
              </h3>
              <ul class="space-y-1.5">
                <li
                  v-for="company in movie.production_companies.slice(0, 4)"
                  :key="company.id"
                  class="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2"
                >
                  <span class="w-1.5 h-1.5 bg-primary dark:bg-gray-600 rounded-full shrink-0" />
                  {{ company.name }}
                </li>
              </ul>
            </div>

            <!-- Homepage link -->
            <a
              v-if="movie.homepage"
              :href="movie.homepage"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary dark:bg-gray-800 text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-primary-light dark:hover:bg-gray-700 dark:border border-gray-700 rounded-lg text-sm font-semibold transition"
            >
              <v-icon name="md-openinnew-round" class="w-4 h-4" />

              Official Website
            </a>
          </aside>
        </div>
      </div>
    </template>
  </div>
</template>
