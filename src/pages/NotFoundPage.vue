<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const countdown = ref(10);
let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      router.push({ name: "home" });
    }
  }, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="text-center space-y-6 max-w-md">
      <!-- 404 graphic -->
      <div class="relative mx-auto w-40 h-40">
        <!-- Film reel BG -->
        <div class="absolute inset-0 rounded-full bg-gray-800/80 flex items-center justify-center">
          <svg class="w-16 h-16 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"
            />
          </svg>
        </div>
        <!-- 404 label -->
        <div
          class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-gray-900 font-black text-2xl px-4 py-1 rounded-lg whitespace-nowrap shadow-lg"
        >
          404
        </div>
      </div>

      <!-- Text -->
      <div class="pt-4 space-y-2">
        <h1 class="text-2xl font-bold text-white">Page Not Found</h1>
        <p class="text-gray-400 text-sm leading-relaxed">
          Looks like this reel is missing from the vault. The page you're looking for doesn't exist
          or has been moved.
        </p>
      </div>

      <!-- Countdown -->
      <p class="text-gray-600 text-xs">
        Redirecting to home in
        <span class="text-primary font-semibold tabular-nums">{{ countdown }}s</span>
      </p>

      <!-- Actions -->
      <div class="flex items-center justify-center gap-3 pt-2">
        <RouterLink
          :to="{ name: 'home' }"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-gray-900 font-semibold text-sm rounded-lg hover:bg-yellow-300 transition"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Go Home
        </RouterLink>
        <button
          class="px-5 py-2.5 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700 text-sm font-medium rounded-lg transition"
          @click="router.back()"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>
