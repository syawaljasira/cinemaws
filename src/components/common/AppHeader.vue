<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import { useWatchlistStore } from "@/stores/watchlist";
import { useSearchStore } from "@/stores/search.ts";
import CastSuggestions from "../movie/CastSuggestions.vue";
import logo from "@/assets/logo-primary.svg";
import MovieSuggestions from "../movie/MovieSuggestions.vue";

const route = useRoute();
const themeStore = useThemeStore();
const watchlistStore = useWatchlistStore();
const searchStore = useSearchStore();

const mobileMenuOpen = ref<boolean>(false);

// Sync input → URL query param

const handleSearchMobile = () => {
  searchStore.handleSearch();
  mobileMenuOpen.value = false;
};

const toggleMenuOpen = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Watchlist", to: "/watchlist" },
];
</script>

<template>
  <header class="w-full fixed top-4 z-50 px-4 md:px-8">
    <div
      class="max-w-7xl mx-auto px-4 md:px-6"
      :class="[themeStore.isDark ? 'glass-dark' : 'glass-light']"
    >
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="relative h-full flex items-center gap-2 text-gray-700 dark:text-primary font-bold text-xl tracking-tight hover:text-primary-300 transition pr-12"
        >
          <div class="w-auto flex items-center gap-1.5 overflow-hidden leading-none">
            <img :src="logo" alt="Cinemaws" class="w-6 h-6 object-center" />
            Cinemaws
          </div>
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
                ? 'text-primary-dark dark:text-primary bg-gray-100/20 dark:bg-primary/10'
                : 'text-gray-700 dark:text-gray-400 hover:text-gray-800 hover:bg-primary-light/50 dark:hover:text-white dark:hover:bg-gray-800 '
            "
          >
            {{ link.name }}
            <!-- Watchlist badge -->
            <span
              v-if="link.to === '/watchlist' && watchlistStore.count > 0"
              class="absolute -top-1 -right-1 w-4 h-4 bg-gray-700 dark:bg-primary text-primary-light dark:text-gray-900 text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ watchlistStore.count > 9 ? "9+" : watchlistStore.count }}
            </span>
          </RouterLink>
        </nav>

        <!-- Right actions -->
        <div class="relative flex items-center gap-3 md:gap-4">
          <!-- Search bar -->
          <form @submit.prevent="searchStore.handleSearch" class="relative w-72 hidden md:block">
            <div
              class="relative z-50 flex bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-500 border rounded-xl pl-3 pr-3 py-2"
              :class="[
                searchStore.isFocus
                  ? 'shadow-lg shadow-primary-light/40 border-primary-dark'
                  : 'border-gray-400 dark:border-gray-700',
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
                    class="w-5 h-5 text-gray-700 dark:text-gray-500"
                  />
                </Transition>

                <Transition name="fade2">
                  <button
                    v-if="searchStore.search"
                    @click="searchStore.clear"
                    type="button"
                    class="text-gray-700 dark:text-gray-500 hover:text-gray-800 hover:bg-gray-300 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <v-icon name="md-close-round" class="w-5 h-5" />
                  </button>
                </Transition>
              </div>

              <div
                v-if="searchStore.isFocus && searchStore.search"
                class="absolute top-10 left-0 w-full h-auto flex flex-col gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg shadow-primary-light/40 border border-primary-dark"
              >
                <!-- View all -->
                <button
                  type="button"
                  @click="searchStore.handleSearch"
                  class="inline-flex items-center gap-1.5 text-base text-gray-700 dark:text-gray-400 font-medium leading-none hover:bg-gray-300 dark:hover:bg-gray-700 p-3 rounded-xl transition"
                >
                  <v-icon name="md-search-round" class="w-5 h-5" />
                  {{ searchStore.search }}
                </button>

                <!-- Cast Suggestions -->
                <CastSuggestions />

                <!-- Movie Suggestions -->
                <MovieSuggestions />
              </div>
            </div>
          </form>

          <!-- Theme toggle -->
          <button
            class="p-1 text-gray-700 dark:text-gray-400 hover:text-gray-800 hover:bg-primary-light/50 dark:hover:text-white dark:hover:bg-gray-800 rounded-lg transition"
            :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="themeStore.toggle()"
          >
            <v-icon name="md-lightmode-outlined" v-if="themeStore.isDark" class="w-5 h-5" />
            <v-icon name="md-darkmode-outlined" v-else class="w-5 h-5" />
          </button>

          <!-- Mobile menu toggle -->
          <button
            class="md:hidden text-gray-700 dark:text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <v-icon v-if="!mobileMenuOpen" name="hi-solid-menu" class="w-5 h-5" />
            <v-icon v-else name="md-close-round" class="w-5 h-5" />
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
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-gray-800"
        :class="[themeStore.isDark ? 'glass-dark' : 'glass-light']"
      >
        <nav class="px-4 py-3 flex flex-col gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition"
            :class="
              route.path === link.to
                ? 'text-primary-dark dark:text-primary bg-primary/20 dark:bg-primary/10'
                : 'text-gray-700 dark:text-gray-400'
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

        <div>
          <form
            @submit.prevent="handleSearchMobile"
            class="relative w-full block md:hidden px-4 py-3"
          >
            <div
              class="relative z-50 flex bg-gray-100/30 text-gray-800 dark:bg-gray-800 dark:text-gray-500 border rounded-xl pl-3 pr-3 py-2"
              :class="[
                searchStore.isFocus
                  ? 'shadow-lg shadow-primary-light/40 border-primary-dark'
                  : 'border-gray-400 dark:border-gray-700',
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
                    class="w-5 h-5 text-gray-700 dark:text-gray-500"
                  />
                </Transition>

                <Transition name="fade2">
                  <button
                    v-if="searchStore.search"
                    @click="searchStore.clear"
                    type="button"
                    class="text-gray-700 dark:text-gray-500 hover:text-gray-800 hover:bg-gray-300 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <v-icon name="md-close-round" class="w-5 h-5" />
                  </button>
                </Transition>
              </div>

              <div
                v-if="searchStore.isFocus && searchStore.search"
                class="absolute top-10 left-0 w-full h-auto flex flex-col gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg shadow-primary-light/40 border border-primary-dark"
              >
                <!-- View all -->
                <button
                  type="button"
                  @click="handleSearchMobile"
                  class="inline-flex items-center gap-1.5 text-base text-gray-700 dark:text-gray-400 font-medium leading-none hover:bg-gray-300 dark:hover:bg-gray-700 p-3 rounded-xl transition"
                >
                  <v-icon name="md-search-round" class="w-5 h-5" />
                  {{ searchStore.search }}
                </button>

                <!-- Cast Suggestions -->
                <CastSuggestions :toggleMenuOpen="toggleMenuOpen" />

                <!-- Movie Suggestions -->
                <MovieSuggestions @toggle-menu-open="toggleMenuOpen" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
.glass-dark {
  background: rgba(5, 12, 30, 0.8);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.3px);
  -webkit-backdrop-filter: blur(5.3px);
  border: 1px solid rgba(3, 7, 18, 0.34);
}

.glass-light {
  background: rgba(240, 231, 220, 0.8);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(240, 231, 220, 0.1);
  backdrop-filter: blur(5.3px);
  -webkit-backdrop-filter: blur(5.3px);
  border: 1px solid rgba(240, 231, 220, 0.34);
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
