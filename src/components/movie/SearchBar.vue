<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  modelValue?: string;
  autofocus?: boolean;
  placeholder?: string;
  inline?: boolean; // true = emit, false = navigate to /search
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  search: [query: string];
}>();

const router = useRouter();
const localQuery = ref(props.modelValue ?? "");

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  localQuery.value = val;
  emit("update:modelValue", val);
  if (props.inline) emit("search", val);
}

function onSubmit() {
  if (!localQuery.value.trim()) return;
  if (props.inline) {
    emit("search", localQuery.value);
  } else {
    router.push({ name: "search", query: { q: localQuery.value } });
  }
}

function clear() {
  localQuery.value = "";
  emit("update:modelValue", "");
  emit("search", "");
}
</script>

<template>
  <form class="relative w-full" @submit.prevent="onSubmit">
    <!-- Search icon -->
    <svg
      class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
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

    <input
      :value="localQuery"
      :placeholder="placeholder ?? 'Search movies...'"
      :autofocus="autofocus"
      type="search"
      class="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-xl pl-12 pr-12 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      @input="onInput"
    />

    <!-- Clear button -->
    <button
      v-if="localQuery"
      type="button"
      class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
      @click="clear"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </form>
</template>
