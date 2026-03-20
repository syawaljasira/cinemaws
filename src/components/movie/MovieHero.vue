<script setup lang="ts">
import { useImageUrl } from "@/composables/useImageUrl";
import { formatYear } from "@/utils/formatDate";
import { formatRating, formatRuntime } from "@/utils/formatRating";
import WatchlistButton from "./WatchlistButton.vue";
import type { MovieDetail } from "@/types/movie";

defineProps<{
  movie: MovieDetail;
}>();

const { getBackdropUrl } = useImageUrl();
</script>

<template>
  <section class="relative h-[86vh] min-h-120 flex items-end">
    <!-- Backdrop -->
    <div class="absolute inset-0 overflow-hidden">
      <img
        :src="getBackdropUrl(movie.backdrop_path, 'original')"
        :alt="movie.title"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/35 to-transparent" />
      <div
        class="absolute inset-0 bg-linear-to-r from-gray-950/70 via-gray-950/20 to-transparent"
      />
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div class="max-w-2xl space-y-4">
        <!-- Tagline -->
        <p v-if="movie.tagline" class="text-primary text-sm font-medium italic">
          "{{ movie.tagline }}"
        </p>

        <!-- Title -->
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          {{ movie.title }}
        </h1>

        <!-- Meta row -->
        <div class="flex flex-wrap items-center gap-3 text-sm text-gray-400">
          <span class="flex items-center gap-1 text-amber-300 font-bold">
            <v-icon name="md-star-round" class="w-4 h-4" />
            {{ formatRating(movie.vote_average) }}
          </span>
          <span class="w-1 h-1 bg-gray-600 rounded-full" />
          <span>{{ formatYear(movie.release_date) }}</span>
          <span v-if="movie.runtime" class="w-1 h-1 bg-gray-600 rounded-full" />
          <span v-if="movie.runtime">{{ formatRuntime(movie.runtime) }}</span>
          <span class="w-1 h-1 bg-gray-600 rounded-full" />
          <span class="uppercase text-xs tracking-wider bg-gray-800 px-2 py-0.5 rounded">
            {{ movie.original_language }}
          </span>
        </div>

        <!-- Genres -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="genre in movie.genres"
            :key="genre.id"
            class="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
          >
            {{ genre.name }}
          </span>
        </div>

        <!-- Overview -->
        <p class="text-gray-300 text-sm leading-relaxed line-clamp-2">
          {{ movie.overview }}
        </p>

        <!-- CTA -->
        <WatchlistButton :movie="movie" />
      </div>
    </div>
  </section>
</template>
