<script setup lang="ts">
import type { Genre } from "@/types/movie";

defineProps<{
  genres: Genre[];
  selected: number | null;
}>();

const emit = defineEmits<{
  select: [genreId: number | null];
}>();
</script>

<template>
  <div class="flex items-center gap-2 flex-wrap">
    <button
      class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
      :class="
        selected === null
          ? 'bg-primary-light dark:bg-primary text-gray-900'
          : 'bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
      "
      @click="emit('select', null)"
    >
      All
    </button>
    <button
      v-for="genre in genres"
      :key="genre.id"
      class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
      :class="
        selected === genre.id
          ? 'bg-primary-light dark:bg-primary text-gray-900'
          : 'bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
      "
      @click="emit('select', genre.id)"
    >
      {{ genre.name }}
    </button>
  </div>
</template>
