<script setup lang="ts">
import { watch, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSearchMovies } from "@/composables/useSearchMovies";
import { useIntersectionObserver } from "@vueuse/core";
import MovieGrid from "@/components/movie/MovieGrid.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import LoadingState from "@/components/common/LoadingState.vue";
import { useImageUrl } from "@/composables/useImageUrl.ts";

const route = useRoute();
const router = useRouter();
const { getAvatarUrl } = useImageUrl();

const {
  query,
  results,
  cast: castDetails,
  totalPages,
  page,
  isLoading,
  error,
  debouncedSearch,
  loadMore,
} = useSearchMovies();

const hasMore = () => page.value < totalPages.value;
const hasSearched = ref(false);
const q = route.query.q as string;
const cast = route.query.cast as string;

// Sync query param → search
onMounted(() => {
  if (q) {
    query.value = q;
    hasSearched.value = true;
    debouncedSearch();
  }
  if (cast) {
    query.value = cast;
    hasSearched.value = true;
    debouncedSearch();
  }
});

// Sync input → URL query param
watch(query, (val) => {
  if (cast) {
    router.replace({ name: "search", query: val ? { cast: val } : {} });
  } else {
    router.replace({ name: "search", query: val ? { q: val } : {} });
  }
  hasSearched.value = !!val.trim();
  debouncedSearch();
});

// Infinite scroll
const sentinel = ref<HTMLElement | null>(null);

useIntersectionObserver(sentinel, ([entry]) => {
  if (entry?.isIntersecting && hasMore() && !isLoading.value) {
    loadMore();
  }
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 space-y-8">
    <!-- Header -->
    <div class="space-y-1">
      <h1 class="text-2xl font-bold text-gray-700 dark:text-white">Search Movies</h1>
      <p class="text-gray-600 dark:text-gray-500 text-sm">
        Find any movie from millions in the TMDB database
      </p>
    </div>

    <div
      v-if="!isLoading && results.length && castDetails !== null && cast"
      class="inline-flex flex-col items-center gap-2"
    >
      <div type="button" class="w-24 h-24 rounded-full overflow-hidden bg-gray-800 shrink-0">
        <img
          :src="getAvatarUrl(castDetails.profile_path)"
          :alt="castDetails.name"
          class="w-full h-full object-cover"
        />
      </div>
      <p class="text-gray-700 dark:text-white text-base font-medium line-clamp-1">
        {{ castDetails.name }}
      </p>
    </div>

    <!-- Results count -->
    <div v-if="hasSearched && !isLoading && results.length" class="text-gray-500 text-sm">
      Showing
      <span class="text-gray-700 dark:text-white font-medium">{{ results.length }}</span> results
      for
      <span class="text-primary font-medium">"{{ query }}"</span>
    </div>

    <!-- Loading initial -->
    <LoadingState v-if="isLoading && !results.length" message="Searching..." />

    <!-- Error -->
    <div v-else-if="error" class="text-center py-10 text-red-500 dark:text-red-400 text-sm">
      {{ error }}
    </div>

    <!-- Empty — no results -->
    <EmptyState
      v-else-if="hasSearched && !isLoading && !results.length"
      icon="search"
      title="No results found"
      :description="`We couldn't find anything for '${query}'. Try a different keyword.`"
    />

    <!-- Empty — initial state -->
    <EmptyState
      v-else-if="!hasSearched"
      icon="search"
      title="Start searching"
      description="Type a movie title above to get started."
    >
      <RouterLink
        :to="{ name: 'home' }"
        class="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-gray-900 font-semibold text-sm rounded-lg hover:bg-primary-light transition"
      >
        <v-icon name="hi-film" class="w-4 h-4" />
        Browse Movies
      </RouterLink>
    </EmptyState>

    <!-- Results grid -->
    <MovieGrid v-else :movies="results" :loading="isLoading" />

    <!-- Load more spinner + sentinel -->
    <div ref="sentinel" class="h-4" />
  </div>
</template>
