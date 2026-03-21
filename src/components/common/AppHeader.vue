<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import { useWatchlistStore } from "@/stores/watchlist";
import { useSearchStore } from "@/stores/search.ts";
import { useImageUrl } from "@/composables/useImageUrl.ts";
import LoadingState from "./LoadingState.vue";
import EmptyState from "./EmptyState.vue";

const route = useRoute();
const router = useRouter();
const themeStore = useThemeStore();
const watchlistStore = useWatchlistStore();
const searchStore = useSearchStore();
const { getPosterUrl } = useImageUrl();

const mobileMenuOpen = ref<boolean>(false);

// Sync input → URL query param

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Watchlist", to: "/watchlist" },
];

function handleNavigate(e: MouseEvent, id: string | number) {
  searchStore.setFocus(false);
  router.push({ name: "movie", params: { id } });
}
</script>

<template>
  <header class="w-full fixed top-4 z-50 px-8">
    <div class="max-w-7xl mx-auto px-4 lg:px-6 glass">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="flex items-center gap-2 text-primary font-bold text-xl tracking-tight hover:text-primary-300 transition pr-12"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"
            />
          </svg>
          Cinemaws
        </RouterLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="
              route.path === link.to
                ? 'text-primary bg-primary/10'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            "
          >
            {{ link.name }}
            <!-- Watchlist badge -->
            <span
              v-if="link.to === '/watchlist' && watchlistStore.count > 0"
              class="absolute -top-1 -right-1 w-4 h-4 bg-primary text-gray-900 text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ watchlistStore.count > 9 ? "9+" : watchlistStore.count }}
            </span>
          </RouterLink>
        </nav>

        <!-- Right actions -->
        <div class="relative flex items-center gap-4">
          <!-- Search bar -->
          <form @submit.prevent="searchStore.handleSearch" class="relative w-72">
            <div
              class="relative z-50 flex bg-gray-800 text-gray-500 border rounded-xl pl-3 pr-3 py-2"
              :class="[
                searchStore.isFocus
                  ? 'shadow-lg shadow-primary-light/40 border-primary-dark'
                  : 'border-gray-700',
              ]"
            >
              <input
                class="w-56 text-sm hover:border-primary/50 transition focus:outline-1 focus:outline-none"
                :class="[searchStore.isFocus ? 'absolute' : 'relative']"
                type="text"
                v-model="searchStore.search"
                placeholder="Search movies..."
                @focus="searchStore.setFocus(true)"
              />

              <div class="relative ml-auto h-5">
                <Transition name="fade1">
                  <v-icon
                    v-if="!searchStore.search"
                    name="md-search-round"
                    class="w-5 h-5 text-gray-500"
                  />
                </Transition>

                <Transition name="fade2">
                  <button
                    v-if="searchStore.search"
                    @click="searchStore.clear"
                    type="button"
                    class="text-gray-500 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition"
                  >
                    <v-icon name="md-close-round" class="w-5 h-5" />
                  </button>
                </Transition>
              </div>

              <div
                v-if="searchStore.isFocus && searchStore.search"
                class="absolute top-10 left-0 w-full h-auto flex flex-col gap-1 bg-gray-800 rounded-xl shadow-lg shadow-primary-light/40 border border-primary-dark"
              >
                <!-- View all -->
                <button
                  type="button"
                  @click="searchStore.handleSearch"
                  class="inline-flex items-center gap-1.5 text-base text-gray-400 font-medium leading-none hover:bg-gray-700 p-3 rounded-xl transition"
                >
                  <v-icon name="md-search-round" class="w-5 h-5" />
                  {{ searchStore.search }}
                </button>

                <!-- Results -->
                <div
                  v-if="searchStore.suggestions?.length > 0 && !searchStore.isLoading"
                  class="flex flex-col gap-1"
                >
                  <button
                    type="button"
                    v-for="movie in searchStore.suggestions"
                    :key="movie?.id"
                    class="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-700 transition-colors rounded-xl cursor-pointer"
                    @click.capture="(e) => handleNavigate(e, movie?.id)"
                  >
                    <!-- Poster mini -->
                    <img
                      v-if="movie?.poster_path"
                      :src="getPosterUrl(movie?.poster_path, 'w92')"
                      :alt="movie?.title"
                      class="w-10 h-12 rounded object-cover shrink-0"
                    />
                    <div
                      v-else
                      class="w-10 h-14 rounded bg-gray-700 flex items-center justify-center shrink-0"
                    >
                      <span class="text-xs text-gray-400">N/A</span>
                    </div>
                    <!-- Info -->
                    <div class="min-w-0">
                      <p class="text-sm text-white font-medium truncate">
                        {{ movie?.title }}
                      </p>
                      <p class="text-xs text-gray-400">
                        {{ movie?.release_date?.slice(0, 4) || "Unknown" }}
                        <span v-if="movie?.vote_average" class="ml-2 text-yellow-400">
                          ★ {{ movie?.vote_average.toFixed(1) }}
                        </span>
                      </p>
                    </div>
                  </button>
                </div>
                <LoadingState v-if="searchStore.isLoading" message="Searching..." />
                <EmptyState
                  v-else-if="
                    searchStore.isEmpty && !searchStore.isLoading && !searchStore.suggestions.length
                  "
                  class="px-3 pt-0 pb-10"
                  icon="search"
                  title="No results found"
                  :description="`We couldn't find anything for '${searchStore.search}'. Try a different keyword.`"
                />
              </div>
            </div>
          </form>

          <!-- Theme toggle -->
          <button
            class="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
            :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="themeStore.toggle()"
          >
            <v-icon name="md-lightmode-outlined" v-if="themeStore.isDark" class="w-5 h-5" />
            <v-icon name="md-darkmode-outlined" v-else class="w-5 h-5" />
          </button>

          <!-- Mobile menu toggle -->
          <button
            class="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-800 bg-gray-900">
        <nav class="px-4 py-3 flex flex-col gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition"
            :class="
              route.path === link.to
                ? 'text-primary bg-primary/10'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            "
            @click="mobileMenuOpen = false"
          >
            {{ link.name }}
            <span
              v-if="link.to === '/watchlist' && watchlistStore.count > 0"
              class="w-5 h-5 bg-primary text-gray-900 text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ watchlistStore.count }}
            </span>
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
.glass {
  background: rgba(5, 12, 30, 0.8);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.3px);
  -webkit-backdrop-filter: blur(5.3px);
  border: 1px solid rgba(3, 7, 18, 0.34);
}

.fade1-enter-active,
.fade1-leave-active,
.fade2-enter-active,
.fade2-leave-active {
  transition: all 0.2s ease-in;
}
.fade1-enter-from,
.fade1-leave-to,
.fade2-enter-from,
.fade2-leave-to {
  opacity: 0;
  scale: 0.8;
  position: absolute;
  left: 0;
}
</style>
