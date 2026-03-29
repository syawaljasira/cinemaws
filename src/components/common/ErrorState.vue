<script setup lang="ts">
defineProps<{
  message?: string;
  retryLabel?: string;
  parentClass?: string;
}>();

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 py-16 text-center"
    :class="parentClass"
  >
    <div class="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
      <v-icon name="md-warningamber-round" class="w-7 h-7 text-red-500 dark:text-red-400" />
    </div>
    <div>
      <p class="text-gray-700 dark:text-white font-medium">Something went wrong</p>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
        {{ message ?? "An unexpected error occurred." }}
      </p>
    </div>
    <button
      v-if="$attrs.onRetry"
      class="px-4 py-2 text-sm bg-primary text-gray-900 font-medium rounded-lg hover:bg-primary-light transition"
      @click="$emit('retry')"
    >
      {{ retryLabel ?? "Try Again" }}
    </button>
  </div>
</template>
