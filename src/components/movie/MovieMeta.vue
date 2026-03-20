<script setup lang="ts">
import { computed } from "vue";
import { useImageUrl } from "@/composables/useImageUrl";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatRating";
import type { MovieDetail, Credits } from "@/types/movie";

const props = defineProps<{
  movie: MovieDetail;
  credits?: Credits | null;
}>();

const { getAvatarUrl } = useImageUrl();

const topCast = computed(() => props.credits?.cast.slice(0, 8) ?? []);

const metaItems = computed(() => [
  { label: "Status", value: props.movie.status },
  { label: "Release Date", value: formatDate(props.movie.release_date) },
  { label: "Budget", value: formatCurrency(props.movie.budget) },
  { label: "Revenue", value: formatCurrency(props.movie.revenue) },
  { label: "Original Language", value: props.movie.original_language?.toUpperCase() },
]);
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
          class="flex flex-col items-center text-center gap-2"
        >
          <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-800 shrink-0">
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

    <!-- Details -->
    <div>
      <h2 class="text-white font-semibold text-lg mb-4">Details</h2>
      <dl class="space-y-3">
        <div
          v-for="item in metaItems"
          :key="item.label"
          class="flex justify-between items-center py-2 border-b border-gray-800 last:border-0"
        >
          <dt class="text-gray-500 text-sm">{{ item.label }}</dt>
          <dd class="text-white text-sm font-medium">{{ item.value }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>
