<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";

import { useMovies } from "@/composables/useMovies";
import { useGenres } from "@/composables/useGenres";
import { useImageUrl } from "@/composables/useImageUrl";
import { formatYear } from "@/utils/formatDate";
import { formatRating } from "@/utils/formatRating";
import { movieService } from "@/services/movieService";
import { useIntersectionObserver } from "@vueuse/core";
import MovieGrid from "@/components/movie/MovieGrid.vue";
import GenreFilter from "@/components/movie/GenreFilter.vue";
import WatchlistButton from "@/components/movie/WatchlistButton.vue";
import type { Movie, MovieListType } from "@/types/movie";
// import SearchBar from "@/components/movie/SearchBar.vue";

const { getBackdropUrl, getPosterUrl } = useImageUrl();

// ── Featured Hero ───────────────────────────────────────────────
const featuredMovie = ref<Movie | null>(null);
const heroImageError = ref(false);

async function fetchFeatured() {
  try {
    const { data } = await movieService.getMovies("popular", 1);
    const movies = data.results.filter((m) => m.backdrop_path);
    const randomIndex = Math.floor(Math.random() * Math.min(movies.length, 10));
    featuredMovie.value = movies[randomIndex] || null;
    console.log("Featured movie:", featuredMovie.value);
  } catch {
    featuredMovie.value = null;
  }
}

// ── Tabs ────────────────────────────────────────────────────────
const tabs: { label: string; value: MovieListType }[] = [
  { label: "Popular", value: "popular" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Now Playing", value: "now_playing" },
  { label: "Upcoming", value: "upcoming" },
];
const activeTab = ref<MovieListType>("popular");

// ── Genre filter ─────────────────────────────────────────────────
const { genres, fetch: fetchGenres } = useGenres();
const selectedGenre = ref<number | null>(null);
const genreMovies = ref<Movie[]>([]);
const genreLoading = ref(false);
const genrePage = ref(1);
const genreTotalPages = ref(1);

const showingGenre = computed(() => selectedGenre.value !== null);

async function fetchByGenre(reset = true) {
  if (!selectedGenre.value) return;
  if (reset) {
    genrePage.value = 1;
    genreMovies.value = [];
  }
  genreLoading.value = true;
  try {
    const { data } = await movieService.getMoviesByGenre(selectedGenre.value, genrePage.value);
    genreMovies.value = reset ? data.results : [...genreMovies.value, ...data.results];
    genreTotalPages.value = data.total_pages;
  } finally {
    genreLoading.value = false;
  }
}

function onGenreSelect(id: number | null) {
  selectedGenre.value = id;
  if (id !== null) fetchByGenre(true);
}

// ── Tab movies (with infinite scroll) ────────────────────────────
// const { movies, isLoading, error, fetch, loadMore, hasMore } = useMovies(activeTab.value);

watch(activeTab, async (type) => {
  selectedGenre.value = null;
  const { fetch: newFetch } = useMovies(type);
  await newFetch(true);
});

// Re-init when tab changes — simpler approach using a key
const tabMovies = ref<Movie[]>([]);
const tabLoading = ref(false);
const tabError = ref<string | null>(null);
const tabPage = ref(1);
const tabTotalPages = ref(1);
const tabHasMore = computed(() => tabPage.value < tabTotalPages.value);

async function fetchTabMovies(reset = true) {
  if (reset) {
    tabPage.value = 1;
    tabMovies.value = [];
  }
  tabLoading.value = true;
  tabError.value = null;
  try {
    const { data } = await movieService.getMovies(activeTab.value, tabPage.value);
    tabMovies.value = reset ? data.results : [...tabMovies.value, ...data.results];
    tabTotalPages.value = data.total_pages;
  } catch (e) {
    tabError.value = e instanceof Error ? e.message : "Failed to load movies";
  } finally {
    tabLoading.value = false;
  }
}

watch(activeTab, () => {
  selectedGenre.value = null;
  fetchTabMovies(true);
});

// ── Infinite scroll sentinel ──────────────────────────────────────
const sentinel = ref<HTMLElement | null>(null);

useIntersectionObserver(sentinel, ([entry]) => {
  if (!entry || !entry.isIntersecting) return;
  if (showingGenre.value) {
    if (!genreLoading.value && genrePage.value < genreTotalPages.value) {
      genrePage.value++;
      fetchByGenre(false);
    }
  } else {
    if (!tabLoading.value && tabHasMore.value) {
      tabPage.value++;
      fetchTabMovies(false);
    }
  }
});

onMounted(() => {
  fetchFeatured();
  fetchGenres();
  fetchTabMovies(true);
});

console.log(featuredMovie.value);
</script>

<template>
  <div>
    <!-- ── Hero ── -->
    <section v-if="featuredMovie" class="relative h-[78vh] min-h-120 flex items-end">
      <div class="absolute inset-0 overflow-hidden">
        <img
          v-if="!heroImageError"
          :src="getBackdropUrl(featuredMovie.backdrop_path, 'original')"
          :alt="featuredMovie.title"
          class="w-full h-full object-cover"
          @error="heroImageError = true"
        />
        <div class="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/35 to-gray-950/10" />
        <div
          class="absolute inset-0 bg-linear-to-r from-gray-950/60 via-gray-950/25 to-transparent"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <div class="flex flex-col sm:flex-row items-end gap-6 max-w-3xl">
          <!-- Poster thumbnail -->
          <img
            :src="getPosterUrl(featuredMovie.poster_path, 'w300')"
            :alt="featuredMovie.title"
            class="hidden sm:block w-24 rounded-lg shadow-2xl shrink-0"
          />
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-xs bg-primary text-gray-900 font-bold px-2 py-0.5 rounded"
                >FEATURED</span
              >
              <span class="text-gray-400 text-sm">{{
                formatYear(featuredMovie.release_date)
              }}</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-bold text-white leading-tight">
              {{ featuredMovie.title }}
            </h1>
            <div class="flex items-center gap-2 text-sm text-primary font-semibold">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              {{ formatRating(featuredMovie.vote_average) }}
            </div>
            <p class="text-gray-300 text-sm leading-relaxed line-clamp-2 max-w-xl">
              {{ featuredMovie.overview }}
            </p>
            <div class="flex items-center gap-3 pt-1">
              <RouterLink
                :to="{ name: 'movie', params: { id: featuredMovie.id } }"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-gray-900 font-semibold text-sm rounded-lg hover:bg-yellow-300 transition"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                View Details
              </RouterLink>
              <WatchlistButton :movie="featuredMovie" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Main content ── -->
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <!-- Search bar shortcut -->
      <RouterLink :to="{ name: 'search' }" class="block" tabindex="-1">
        <div class="relative w-full max-w-xl">
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <div
            class="w-full bg-gray-800 text-gray-500 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition"
          >
            Search movies...
          </div>
        </div>
      </RouterLink>

      <!-- Tabs -->
      <div
        class="flex items-center gap-1 border-b border-gray-800 overflow-x-auto scrollbar-hide pb-px"
      >
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors shrink-0"
          :class="
            activeTab === tab.value && !showingGenre
              ? 'text-primary'
              : 'text-gray-500 hover:text-gray-300'
          "
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span
            v-if="activeTab === tab.value && !showingGenre"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
          />
        </button>
      </div>

      <!-- Genre filter -->
      <div>
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Browse by Genre
        </h3>
        <GenreFilter :genres="genres" :selected="selectedGenre" @select="onGenreSelect" />
      </div>

      <!-- Grid -->
      <MovieGrid
        :movies="showingGenre ? genreMovies : tabMovies"
        :loading="showingGenre ? genreLoading : tabLoading"
      />

      <!-- Error -->
      <div v-if="tabError && !showingGenre" class="text-center py-8 text-red-400 text-sm">
        {{ tabError }}
      </div>

      <!-- Infinite scroll sentinel -->
      <div ref="sentinel" class="h-4" />
    </div>
  </div>
</template>
