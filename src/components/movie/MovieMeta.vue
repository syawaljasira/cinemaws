<script setup lang="ts">
import { computed } from "vue";
import { useImageUrl } from "@/composables/useImageUrl";
import type { MovieDetail, Credits } from "@/types/movie";

const props = defineProps<{
  movie: MovieDetail;
  credits?: Credits | null;
}>();

const { getAvatarUrl } = useImageUrl();

const topCast = computed(() => props.credits?.cast.slice(0, 8) ?? []);
</script>

<template>
  <div class="space-y-8">
    <!-- Cast -->
    <div v-if="topCast.length">
      <h2 class="text-white font-semibold text-lg mb-4">Top Cast</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          v-for="actor in topCast"
          :key="actor.id"
          class="w-full flex flex-col items-center text-center gap-2"
        >
          <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-800 shrink-0">
            <img
              :src="getAvatarUrl(actor.profile_path)"
              :alt="actor.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <p class="text-white text-xs font-medium line-clamp-1">{{ actor.name }}</p>
            <p class="text-gray-500 text-xs line-clamp-1">{{ actor.character }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
