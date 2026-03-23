<script setup lang="ts">
import { RouterView } from "vue-router";
import AppHeader from "./components/common/AppHeader.vue";
import AppFooter from "./components/common/AppFooter.vue";
import { useSearchStore } from "./stores/search.ts";

const searchStore = useSearchStore();
</script>

<template>
  <div class="relative min-h-screen bg-slate-100 dark:bg-gray-950 text-white flex flex-col">
    <!-- Backdrop gelap -->
    <Transition name="fade" mode="out-in">
      <div
        v-if="searchStore.isFocus"
        @click="searchStore.setFocus(false)"
        class="absolute inset-0 z-30 bg-black/60"
      />
    </Transition>

    <AppHeader />

    <main class="flex-1">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
