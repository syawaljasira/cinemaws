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
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center space-y-6 max-w-md">
      <!-- 404 graphic -->
      <div class="relative mx-auto w-40 h-40">
        <!-- Film reel BG -->
        <div
          class="absolute inset-0 rounded-full bg-gray-300 dark:bg-gray-800/80 flex items-center justify-center"
        >
          <v-icon name="hi-film" class="w-16 h-16 text-gray-700" />
        </div>
        <!-- 404 label -->
        <div
          class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-gray-700 dark:text-gray-900 font-black text-2xl px-4 py-1 rounded-lg whitespace-nowrap shadow-lg"
        >
          404
        </div>
      </div>

      <!-- Text -->
      <div class="pt-4 space-y-2">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Looks like this reel is missing from the vault. The page you're looking for doesn't exist
          or has been moved.
        </p>
      </div>

      <!-- Countdown -->
      <p class="text-gray-600 dark:text-gray-500 text-xs">
        Redirecting to home in
        <span class="text-primary font-semibold tabular-nums">{{ countdown }}s</span>
      </p>

      <!-- Actions -->
      <div class="flex items-center justify-center gap-3 pt-2">
        <RouterLink
          :to="{ name: 'home' }"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-gray-900 font-semibold text-sm rounded-lg hover:bg-primary-light transition"
        >
          <v-icon name="hi-home" class="w-4 h-4" />
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
