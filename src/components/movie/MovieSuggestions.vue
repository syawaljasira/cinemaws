<script setup lang="ts">
import { useImageUrl } from "@/composables/useImageUrl.ts";
import { useSearchStore } from "@/stores/search.ts";
import { useRouter } from "vue-router";
import LoadingState from "../common/LoadingState.vue";
import EmptyState from "../common/EmptyState.vue";

const emit = defineEmits(["toggle-menu-open"]);

const router = useRouter();
const searchStore = useSearchStore();
const { getPosterUrl } = useImageUrl();

function handleNavigate(e: MouseEvent, id: string | number) {
  emit("toggle-menu-open");
  searchStore.setFocus(false);
  router.push({ name: "movie", params: { id } });
}
</script>

<template>
  <div>
    <div v-if="!searchStore.isMovieEmpty" class="flex flex-col gap-1">
      <button
        type="button"
        v-for="movie in searchStore.movieSuggestions"
        :key="movie?.id"
        class="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors rounded-xl cursor-pointer"
        @click="(e) => handleNavigate(e, movie?.id)"
      >
        <!-- Poster mini -->
        <img
          v-if="movie?.poster_path"
          :src="getPosterUrl(movie?.poster_path, 'w92')"
          :alt="movie?.title"
          class="w-10 h-14 rounded object-cover shrink-0"
        />
        <div
          v-else
          class="w-10 h-14 rounded bg-gray-300 dark:bg-gray-600 flex items-center justify-center shrink-0"
        >
          <span class="text-xs text-gray-600 dark:text-gray-400">N/A</span>
        </div>
        <!-- Info -->
        <div class="min-w-0">
          <p class="text- sm text-gray-700 dark:text-white font-medium truncate">
            {{ movie?.title }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ movie?.release_date?.slice(0, 4) || "Unknown" }}
            <span v-if="movie?.vote_average" class="ml-2 text-yellow-400">
              ★ {{ movie?.vote_average.toFixed(1) }}
            </span>
          </p>
        </div>
      </button>
    </div>
    <LoadingState v-if="searchStore.isMovieLoading" message="Searching..." />
    <EmptyState
      v-else-if="searchStore.isMovieEmpty"
      class="px-3 pt-0 pb-10"
      icon="search"
      title="No results found"
      :description="`We couldn't find anything for '${searchStore.search}'. Try a different keyword.`"
    />
  </div>
</template>

<style scoped></style>
