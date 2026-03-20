import "./assets/main.css";

// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { MdArrowforwardRound } from "oh-vue-icons/icons";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

addIcons(MdArrowforwardRound);

const app = createApp(App);
const pinia = createPinia();
// pinia.use(piniaPluginPersistedstate);

app.use(pinia).use(router).component("v-icon", OhVueIcon).mount("#app");
