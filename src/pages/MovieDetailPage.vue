<script setup lang="ts">
import { watch } from "vue";
// import { useRouter } from "vue-router";
import { useMovieDetail } from "@/composables/useMovieDetail";
import { formatDate } from "@/utils/formatDate";
import { formatRating, formatRuntime, formatCurrency } from "@/utils/formatRating";
import MovieHero from "@/components/movie/MovieHero.vue";
import MovieMeta from "@/components/movie/MovieMeta.vue";
import SimilarMoviesSection from "@/components/movie/SimilarMoviesSection.vue";
import LoadingState from "@/components/common/LoadingState.vue";
import ErrorState from "@/components/common/ErrorState.vue";

const props = defineProps<{
  id: number;
}>();

// const router = useRouter()
const { movie, credits, isLoading, error, fetch } = useMovieDetail();

watch(
  () => props.id,
  (id) => fetch(id),
  { immediate: true },
);
</script>

<template>
  <div>
    <!-- Loading -->
    <LoadingState v-if="isLoading" message="Loading movie details..." :full-screen="true" />

    <!-- Error -->
    <ErrorState
      v-else-if="error"
      :message="error"
      retry-label="Try Again"
      @retry="fetch(props.id)"
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
              <h2 class="text-white font-semibold text-xl mb-3">Overview</h2>
              <p class="text-gray-300 leading-relaxed">
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
            <div class="bg-gray-800/60 rounded-xl p-5 space-y-4">
              <h3 class="text-white font-semibold text-sm uppercase tracking-widest">Movie Info</h3>

              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Rating</span>
                  <span class="text-primary font-bold flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                    {{ formatRating(movie.vote_average) }}
                    <span class="text-gray-500 font-normal"
                      >({{ movie.vote_count.toLocaleString() }})</span
                    >
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-500">Runtime</span>
                  <span class="text-white">{{ formatRuntime(movie.runtime) }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-500">Release Date</span>
                  <span class="text-white">{{ formatDate(movie.release_date) }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-500">Status</span>
                  <span
                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="
                      movie.status === 'Released'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-primary/10 text-primary'
                    "
                  >
                    {{ movie.status }}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-500">Language</span>
                  <span class="text-white uppercase">{{ movie.original_language }}</span>
                </div>

                <div v-if="movie.budget" class="flex justify-between">
                  <span class="text-gray-500">Budget</span>
                  <span class="text-white">{{ formatCurrency(movie.budget) }}</span>
                </div>

                <div v-if="movie.revenue" class="flex justify-between">
                  <span class="text-gray-500">Revenue</span>
                  <span class="text-white">{{ formatCurrency(movie.revenue) }}</span>
                </div>
              </div>
            </div>

            <!-- Genres -->
            <div class="bg-gray-800/60 rounded-xl p-5 space-y-3">
              <h3 class="text-white font-semibold text-sm uppercase tracking-widest">Genres</h3>
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
              class="bg-gray-800/60 rounded-xl p-5 space-y-3"
            >
              <h3 class="text-white font-semibold text-sm uppercase tracking-widest">Production</h3>
              <ul class="space-y-1.5">
                <li
                  v-for="company in movie.production_companies.slice(0, 4)"
                  :key="company.id"
                  class="text-gray-400 text-sm flex items-center gap-2"
                >
                  <span class="w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0" />
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
              class="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Official Website
            </a>
          </aside>
        </div>
      </div>
    </template>
  </div>
</template>
