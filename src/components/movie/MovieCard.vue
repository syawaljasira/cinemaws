<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useImageUrl } from "@/composables/useImageUrl";
import { formatYear } from "@/utils/formatDate";
import { formatRating } from "@/utils/formatRating";
import WatchlistButton from "./WatchlistButton.vue";
import type { Movie } from "@/types/movie";

const props = defineProps<{
  movie: Movie;
}>();

const router = useRouter();
const { getPosterUrl } = useImageUrl();
const imageError = ref(false);

function navigate() {
  router.push({ name: "movie", params: { id: props.movie.id } });
}
</script>

<template>
  <article
    class="group relative bg-primary/20 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
    @click="navigate"
  >
    <!-- Poster -->
    <div class="aspect-2/3 bg-gray-300 dark:bg-gray-700 overflow-hidden">
      <img
        v-if="!imageError"
        :src="getPosterUrl(movie.poster_path)"
        :alt="movie.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        @error="imageError = true"
      />
      <div
        v-else
        class="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-700 dark:text-gray-600"
      >
        <v-icon name="md-image-outlined" class="w-10 h-10" />

        <span class="text-xs">No Image</span>
      </div>
    </div>

    <!-- Hover overlay -->
    <div
      class="absolute inset-0 bg-linear-to-t from-gray-700 via-gray-700/60 to-transparent dark:from-gray-900 dark:via-gray-900/60 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-2"
    >
      <p class="text-white dark:text-gray-300 text-xs line-clamp-3 leading-relaxed">
        {{ movie.overview || "No description available." }}
      </p>
      <WatchlistButton :movie="movie" size="sm" @click.stop />
    </div>

    <!-- Rating badge -->
    <div
      class="absolute top-2 right-2 flex items-center gap-1 bg-gray-700/80 dark:bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-amber-300"
    >
      <v-icon name="md-star-round" class="w-3 h-3" />
      {{ formatRating(movie.vote_average) }}
    </div>

    <!-- Info -->
    <div class="p-3">
      <h3
        class="text-gray-900 dark:text-white text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors"
      >
        {{ movie.title }}
      </h3>
      <p class="text-gray-600 dark:text-gray-500 text-xs mt-0.5">
        {{ formatYear(movie.release_date) }}
      </p>
    </div>
  </article>
</template>
