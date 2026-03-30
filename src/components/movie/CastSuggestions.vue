<script setup lang="ts">
import { useImageUrl } from "@/composables/useImageUrl.ts";
import { useSearchStore } from "@/stores/search.ts";
import { useRouter } from "vue-router";

const emit = defineEmits(["toggle-menu-open"]);

const router = useRouter();
const searchStore = useSearchStore();
const { getAvatarUrl } = useImageUrl();

function handleNavigate(cast: string) {
  emit("toggle-menu-open");
  searchStore.setFocus(false);
  router.push({ name: "search", query: { cast } });
}
</script>

<template>
  <!-- Movie Suggestions -->
  <div>
    <div v-if="!searchStore.isCastEmpty" class="flex flex-col">
      <button
        type="button"
        v-for="cast in searchStore.castSuggestions"
        :key="cast?.id"
        class="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors rounded-xl cursor-pointer"
        @click="handleNavigate(cast?.name)"
      >
        <!-- Poster mini -->
        <img
          v-if="cast?.profile_path"
          :src="getAvatarUrl(cast?.profile_path, 'w92')"
          :alt="cast?.name"
          class="w-8 h-8 rounded-full object-cover shrink-0"
        />
        <div
          v-else
          class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center shrink-0"
        >
          <span class="text-xs text-gray-600 dark:text-gray-400">N/A</span>
        </div>
        <!-- Info -->
        <div class="min-w-0">
          <p class="text-xs text-gray-700 dark:text-white font-medium truncate">
            {{ cast?.name }}
          </p>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
