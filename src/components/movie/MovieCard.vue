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
    class="group relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
    @click="navigate"
  >
    <!-- Poster -->
    <div class="aspect-2/3 bg-gray-700 overflow-hidden">
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
        class="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-600"
      >
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span class="text-xs">No Image</span>
      </div>
    </div>

    <!-- Hover overlay -->
    <div
      class="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-2"
    >
      <p class="text-gray-300 text-xs line-clamp-3 leading-relaxed">
        {{ movie.overview || "No description available." }}
      </p>
      <WatchlistButton :movie="movie" size="sm" @click.stop />
    </div>

    <!-- Rating badge -->
    <div
      class="absolute top-2 right-2 flex items-center gap-1 bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-amber-300"
    >
      <v-icon name="md-star-round" class="w-3 h-3" />
      {{ formatRating(movie.vote_average) }}
    </div>

    <!-- Info -->
    <div class="p-3">
      <h3
        class="text-white text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors"
      >
        {{ movie.title }}
      </h3>
      <p class="text-gray-500 text-xs mt-0.5">{{ formatYear(movie.release_date) }}</p>
    </div>
  </article>
</template>
