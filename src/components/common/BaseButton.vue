<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}>();
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[
      variant === 'primary' || !variant
        ? 'bg-primary text-gray-900 hover:bg-primary-light focus:ring-primary'
        : variant === 'secondary'
          ? 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500'
          : variant === 'ghost'
            ? 'bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-600'
            : 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500',
      size === 'sm'
        ? 'px-3 py-1.5 text-sm'
        : size === 'lg'
          ? 'px-6 py-3 text-base'
          : 'px-4 py-2 text-sm',
    ]"
  >
    <span
      v-if="loading"
      class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
    />
    <slot />
  </button>
</template>
