import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { usePreferredDark } from "@vueuse/core";

export const useThemeStore = defineStore("theme", () => {
  const prefersDark = usePreferredDark();
  const isDark = ref(prefersDark.value);

  function toggle() {
    isDark.value = !isDark.value;
  }

  function apply() {
    document.documentElement.classList.toggle("dark", isDark.value);
  }

  watch(isDark, apply, { immediate: true });

  return { isDark, toggle };
});
