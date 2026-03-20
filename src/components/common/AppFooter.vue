<script setup lang="ts"></script>

<template>
  <footer class="border-t border-gray-800 bg-gray-900 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500"
      >
        <div class="flex items-center gap-2">
          <span class="text-primary font-bold text-base">Cinemaws</span>
          <span>— Built with Vue 3 + TMDB API</span>
        </div>
        <p>
          Movie data provided by
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-primary transition underline underline-offset-2"
          >
            TMDB
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss"></style>
