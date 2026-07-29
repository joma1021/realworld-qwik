/** Official RealWorld Conduit API */
export const BASE_URL = "https://api.realworld.show/api";

/** Fallback avatar used when the API returns a null/empty image */
export const DEFAULT_IMAGE =
  "https://raw.githubusercontent.com/gothinkster/node-express-realworld-example-app/refs/heads/master/src/assets/images/smiley-cyrus.jpeg";

export function resolveImage(image?: string | null): string {
  return image && image.trim() ? image : DEFAULT_IMAGE;
}
