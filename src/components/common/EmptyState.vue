<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  icon?: "search" | "film" | "bookmark";
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-20 text-center">
    <div class="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
      <!-- Search icon -->
      <svg
        v-if="icon === 'search'"
        class="w-7 h-7 text-gray-500"
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
      <!-- Bookmark icon -->
      <svg
        v-else-if="icon === 'bookmark'"
        class="w-7 h-7 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      <!-- Film icon (default) -->
      <svg
        v-else
        class="w-7 h-7 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
        />
      </svg>
    </div>
    <div>
      <p class="text-white font-semibold text-lg">{{ title ?? "Nothing here" }}</p>
      <p class="text-gray-400 text-sm mt-1 max-w-xs mx-auto">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>
