<script setup lang="ts">
import { watch, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSearchMovies } from "@/composables/useSearchMovies";
import { useIntersectionObserver } from "@vueuse/core";
import SearchBar from "@/components/movie/SearchBar.vue";
import MovieGrid from "@/components/movie/MovieGrid.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import LoadingState from "@/components/common/LoadingState.vue";

const route = useRoute();
const router = useRouter();

const { query, results, totalPages, page, isLoading, error, debouncedSearch, loadMore } =
  useSearchMovies();

const hasMore = () => page.value < totalPages.value;
const hasSearched = ref(false);

// Sync query param → search
onMounted(() => {
  const q = route.query.q as string;
  if (q) {
    query.value = q;
    hasSearched.value = true;
    debouncedSearch();
  }
});

// Sync input → URL query param
watch(query, (val) => {
  router.replace({ name: "search", query: val ? { q: val } : {} });
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
      <h1 class="text-2xl font-bold text-white">Search Movies</h1>
      <p class="text-gray-500 text-sm">Find any movie from millions in the TMDB database</p>
    </div>

    <!-- Search bar -->
    <SearchBar
      v-model="query"
      :inline="true"
      placeholder="Search by title, actor, genre..."
      :autofocus="true"
      @search="
        (q) => {
          query = q;
        }
      "
    />

    <!-- Results count -->
    <div v-if="hasSearched && !isLoading && results.length" class="text-gray-500 text-sm">
      Showing <span class="text-white font-medium">{{ results.length }}</span> results for
      <span class="text-primary font-medium">"{{ query }}"</span>
    </div>

    <!-- Loading initial -->
    <LoadingState v-if="isLoading && !results.length" message="Searching..." />

    <!-- Error -->
    <div v-else-if="error" class="text-center py-10 text-red-400 text-sm">
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
    />

    <!-- Results grid -->
    <MovieGrid v-else :movies="results" :loading="isLoading" />

    <!-- Load more spinner + sentinel -->
    <div ref="sentinel" class="h-4" />
  </div>
</template>
