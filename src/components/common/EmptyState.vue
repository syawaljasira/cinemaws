<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  icon?: "search" | "film" | "bookmark";
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-20 text-center">
    <div
      class="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-800 flex items-center justify-center"
    >
      <!-- Search icon -->
      <v-icon
        v-if="icon === 'search'"
        name="md-search-round"
        class="w-7 h-7 text-gray-700 dark:text-gray-500"
      />

      <!-- Bookmark icon -->
      <v-icon
        v-else-if="icon === 'bookmark'"
        name="md-bookmarkborder-round"
        class="w-7 h-7 text-gray-700 dark:text-gray-500"
      />
      <!-- Film icon (default) -->
      <v-icon v-else name="hi-film" class="w-7 h-7 text-gray-700 dark:text-gray-500" />
    </div>
    <div>
      <p class="text-gray-700 dark:text-white font-semibold text-lg">
        {{ title ?? "Nothing here" }}
      </p>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-xs mx-auto">
        {{ description }}
      </p>
    </div>
    <slot />
  </div>
</template>
