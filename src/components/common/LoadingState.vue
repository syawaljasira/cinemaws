<script setup lang="ts">
defineProps<{
  message?: string;
  fullScreen?: boolean;
}>();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 text-gray-400"
    :class="fullScreen ? 'min-h-[60vh]' : 'py-16'"
  >
    <div class="w-10 h-10 border-4 border-gray-700 border-t-primary rounded-full animate-spin" />
    <p class="text-sm">{{ message ?? "Loading..." }}</p>
  </div>
</template>
