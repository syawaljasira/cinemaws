<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import { useWatchlistStore } from "@/stores/watchlist";

const route = useRoute();
const themeStore = useThemeStore();
const watchlistStore = useWatchlistStore();

const mobileMenuOpen = ref(false);

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Search", to: "/search" },
  { name: "Watchlist", to: "/watchlist" },
];
</script>

<template>
  <header class="w-full fixed top-4 z-50 px-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 glass">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="flex items-center gap-2 text-primary font-bold text-xl tracking-tight hover:text-primary-300 transition"
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
        <div class="flex items-center gap-2">
          <!-- Theme toggle -->
          <button
            class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
            :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="themeStore.toggle()"
          >
            <svg
              v-if="themeStore.isDark"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
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

<style lang="scss">
.glass {
  background: rgba(5, 12, 30, 0.8);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.3px);
  -webkit-backdrop-filter: blur(5.3px);
  border: 1px solid rgba(3, 7, 18, 0.34);
}
</style>
