import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: "en-US",
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.status_message ?? error.message ?? "An unexpected error occurred";
    return Promise.reject(new Error(message));
  },
);

export default instance;
