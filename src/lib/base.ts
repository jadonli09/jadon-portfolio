/** Base path prefix for raw public assets (img src, etc.) under a sub-path host. */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefix a /public asset path with the deploy base path. */
export const asset = (p: string) => (p.startsWith("/") ? `${BASE}${p}` : p);
