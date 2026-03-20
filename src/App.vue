<script setup lang="ts">
import { RouterView } from "vue-router";
import AppHeader from "./components/common/AppHeader.vue";
import AppFooter from "./components/common/AppFooter.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col">
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
</style>
