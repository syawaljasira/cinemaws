<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  type?: string;
}>();

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-300">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full bg-gray-800 text-white placeholder-gray-500 border rounded-lg px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      :class="error ? 'border-red-500' : 'border-gray-700 focus:border-primary'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
  </div>
</template>
