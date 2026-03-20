import "./assets/main.css";

// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { OhVueIcon } from "oh-vue-icons";
import { createPinia } from "pinia";
import { createApp } from "vue";

import useIcons from "./composables/addIcons.ts";
import router from "./router";
import App from "./App.vue";

useIcons();

const app = createApp(App);
const pinia = createPinia();
// pinia.use(piniaPluginPersistedstate);

app.use(pinia).use(router).component("v-icon", OhVueIcon).mount("#app");
