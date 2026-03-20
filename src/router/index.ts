import { createRouter, createWebHistory } from "vue-router";

import MovieDetailPage from "@/pages/MovieDetailPage.vue";
import WatchlistPage from "@/pages/WatchlistPage.vue";
import NotFoundPage from "@/pages/NotFoundPage.vue";
import SearchPage from "@/pages/SearchPage.vue";
import HomePage from "@/pages/HomePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
      meta: { title: "Home" },
    },
    {
      path: "/search",
      name: "search",
      component: SearchPage,
      meta: { title: "Search" },
    },
    {
      path: "/watchlist",
      name: "watchlist",
      component: WatchlistPage,
      meta: { title: "Watchlist" },
    },
    {
      path: "/movie/:id",
      name: "movie",
      component: MovieDetailPage,
      meta: { title: "Movie Detail" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundPage,
    },
  ],
  scrollBehavior: (_, __, savedPosition) => savedPosition ?? { top: 0 },
});

export default router;
