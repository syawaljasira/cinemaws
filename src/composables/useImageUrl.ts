const BASE_URL = "https://image.tmdb.org/t/p";

export type ImageSize = "w200" | "w300" | "w500" | "w780" | "original";

export function useImageUrl() {
  function getPosterUrl(path: string | null, size: ImageSize = "w500"): string {
    return path ? `${BASE_URL}/${size}${path}` : "/placeholder-poster.png";
  }

  function getBackdropUrl(path: string | null, size: ImageSize = "w780"): string {
    return path ? `${BASE_URL}/${size}${path}` : "/placeholder-backdrop.png";
  }

  function getAvatarUrl(path: string | null, size: ImageSize = "w200"): string {
    return path ? `${BASE_URL}/${size}${path}` : "/placeholder-avatar.png";
  }

  return { getPosterUrl, getBackdropUrl, getAvatarUrl };
}
